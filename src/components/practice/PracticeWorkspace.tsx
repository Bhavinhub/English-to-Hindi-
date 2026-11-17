"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Play, Square, RotateCcw, LogOut, Lightbulb, Languages, Send, Bot, ScrollText, Info, CheckCircle2, Plus, Users, Gauge, Volume2,
} from "lucide-react";
import { GlassButton, GlassCard, GlassModal, GlassTabs, GlassLink } from "@/components/glass";
import { Container, PageHeader, Pill, SpeakButton } from "@/components/common/ui";
import { MicButton, micStatusText } from "@/components/common/MicButton";
import { Icon } from "@/components/common/Icon";
import { MiraAvatar } from "@/components/landing/MiraAvatar";
import { topics, getTopic, type Topic } from "@/data/conversations";
import { useStore } from "@/lib/store";
import { micErrorText, speak, stopSpeaking, SPEECH_PRIVACY_NOTE, useSpeechRecognition, useTTSSupported } from "@/lib/speech";
import { similarity } from "@/lib/answers";
import { tutorReply } from "@/lib/demo-engine";
import { useServiceStatus } from "@/lib/services";
import type { Level } from "@/lib/types";
import { cn } from "@/lib/cn";

type Msg = { id: string; from: "tutor" | "you"; en: string; hi?: string; coach?: string };
type Phase = "setup" | "active" | "ended";

function coachFor(reply: string, t: Topic["turns"][number]): string {
  const words = reply.trim().split(/\s+/).length;
  const best = Math.max(...t.suggestions.map((s) => similarity(reply, s)));
  if (words < 3) return `Try a full sentence. For example: “${t.suggestions[0]}”`;
  if (best >= 0.8) return "That’s a natural way to say it. Well done!";
  return `Good effort! Another natural way to say this: “${t.suggestions[0]}”`;
}

let msgId = 0;
const mid = () => `m${++msgId}`;

export function PracticeWorkspace() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, actions } = useStore();
  const services = useServiceStatus();
  const tts = useTTSSupported();

  const [topicId, setTopicId] = useState(() => (getTopic(params.get("topic") ?? "") ? (params.get("topic") as string) : "introductions"));
  const [level, setLevel] = useState<Level>(state.profile.level ?? "beginner");
  const [mode, setMode] = useState<"demo" | "ai">("demo");
  const [phase, setPhase] = useState<Phase>("setup");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [turn, setTurn] = useState(0);
  const [hints, setHints] = useState(true);
  const [readAloud, setReadAloud] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const startedAt = useRef<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  // Each session gets a token; late replies from an ended/restarted session are ignored.
  const sessionRef = useRef(0);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readAloudRef = useRef(readAloud);
  const rateRef = useRef(state.prefs.speechRate);
  useEffect(() => {
    readAloudRef.current = readAloud;
    rateRef.current = state.prefs.speechRate;
  });

  const topic = getTopic(topicId)!;
  const rate = state.prefs.speechRate;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // stop playback and pending replies when leaving the page
  useEffect(
    () => () => {
      sessionRef.current++;
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
      stopSpeaking();
    },
    [],
  );

  const say = (text: string) => {
    if (readAloudRef.current && tts) speak(text, { rate: rateRef.current });
  };

  function pushTutor(session: number, en: string, hi?: string) {
    if (session !== sessionRef.current) return; // session ended or restarted
    setMsgs((m) => [...m, { id: mid(), from: "tutor", en, hi }]);
    say(en);
  }

  function cancelPending() {
    sessionRef.current++;
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingTimer.current = null;
    setBusy(false);
  }

  function start(withHints = hints) {
    cancelPending();
    stopSpeaking();
    const session = sessionRef.current;
    startedAt.current = new Date().toISOString();
    setMsgs([]);
    setTurn(0);
    setSaved([]);
    setAiError(null);
    setInput("");
    setPhase("active");
    if (mode === "demo") {
      const first = topic.turns[0].tutor;
      setMsgs([{ id: mid(), from: "tutor", en: first.en, hi: first.hi }]);
      say(first.en);
    } else {
      void askAI(session, [], withHints);
    }
  }

  async function askAI(session: number, history: Msg[], withHints = hints) {
    setBusy(true);
    setAiError(null);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: topic.title,
          scenario: topic.scenario,
          level,
          hindiHints: withHints,
          messages: history.map((m) => ({ role: m.from === "tutor" ? "assistant" : "user", content: m.en })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; hindiHint?: string; error?: string };
      if (session !== sessionRef.current) return;
      if (!res.ok || !data.reply) throw new Error(data.error ?? "The AI service didn’t respond. Please try again or use demo mode.");
      pushTutor(session, data.reply, data.hindiHint);
    } catch (e) {
      if (session !== sessionRef.current) return;
      setAiError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Couldn’t reach the AI service. Check your connection, or use demo mode.");
    } finally {
      if (session === sessionRef.current) setBusy(false);
    }
  }

  function send(text: string) {
    const clean = text.trim();
    if (!clean || phase !== "active" || busy) return;
    const session = sessionRef.current;
    setInput("");
    if (mode === "ai") {
      const you: Msg = { id: mid(), from: "you", en: clean };
      const history = [...msgs, you];
      setMsgs(history);
      void askAI(session, history);
      return;
    }
    const cur = topic.turns[turn];
    if (!cur) return; // conversation already finished
    const you: Msg = { id: mid(), from: "you", en: clean, coach: coachFor(clean, cur) };
    const reply = tutorReply(topic, turn, clean);
    setMsgs((m) => [...m, you]);
    setTurn(turn + 1);
    setBusy(true); // Mira is "typing": no second reply until she answers
    pendingTimer.current = setTimeout(() => {
      pendingTimer.current = null;
      if (session !== sessionRef.current) return;
      pushTutor(session, reply.en, reply.hi);
      setBusy(false);
    }, 450);
  }

  const mic = useSpeechRecognition((t) => send(t));

  function end() {
    cancelPending();
    mic.cancel();
    stopSpeaking();
    const learnerTurns = msgs.filter((m) => m.from === "you").length;
    if (learnerTurns > 0) {
      actions.addPractice({
        id: `ps-${Date.now()}`,
        topicId,
        mode,
        level,
        startedAt: startedAt.current,
        endedAt: new Date().toISOString(),
        learnerTurns,
        savedPhrases: saved.length,
      });
    }
    setPhase("ended");
  }

  function savePhrase(en: string, hi: string) {
    actions.savePhrase({ en, hi, source: "practice" });
    setSaved((s) => (s.includes(en) ? s : [...s, en]));
  }

  const demoDone = mode === "demo" && turn >= topic.turns.length && !busy;
  // release the microphone as soon as the scripted conversation is over
  const micCancel = mic.cancel;
  useEffect(() => {
    if (demoDone) micCancel();
  }, [demoDone, micCancel]);
  const current = mode === "demo" && !demoDone ? topic.turns[turn] : null;
  const lastTutor = [...msgs].reverse().find((m) => m.from === "tutor");
  const usedTurns = topic.turns.slice(0, Math.max(1, Math.min(turn, topic.turns.length)));

  return (
    <Container>
      <PageHeader eyebrow="Speaking practice" title="Practise a conversation" hi="बातचीत की प्रैक्टिस करें">
        Speak or type your replies. Mira helps with Hindi hints and suggested replies.
      </PageHeader>

      {phase === "setup" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <GlassCard padding="lg">
            <h2 className="text-lg font-bold text-ink">1. Choose a topic</h2>
            <div role="radiogroup" aria-label="Conversation topic" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={t.id === topicId}
                  onClick={() => {
                    setTopicId(t.id);
                    router.replace(`/practice?topic=${t.id}`, { scroll: false });
                  }}
                  className={cn("glass glass-hover press flex min-h-24 flex-col items-start justify-between rounded-[20px] p-3 text-left", t.id === topicId && "glass-selected")}
                >
                  <Icon name={t.icon} className="h-5 w-5 text-violet" />
                  <span>
                    <span className="block break-words text-sm font-semibold text-ink">{t.title}</span>
                    <span lang="hi" className="hi block text-xs text-ink-mute">{t.titleHi}</span>
                  </span>
                </button>
              ))}
            </div>
            <h2 className="mt-8 text-lg font-bold text-ink">2. Difficulty</h2>
            <div className="mt-3">
              <GlassTabs semantics="radio" label="Difficulty" idPrefix="diff" value={level} onChange={setLevel} tabs={[{ id: "beginner", label: "Beginner" }, { id: "elementary", label: "Elementary" }, { id: "intermediate", label: "Intermediate" }]} />
              <p className="mt-2 text-sm text-ink-soft">
                {level === "beginner" ? "Hindi help and suggested replies are shown by default." : level === "elementary" ? "Hints are available; try replying before looking." : "Try to answer without hints, in 2–3 sentences."}
              </p>
            </div>
            <h2 className="mt-8 text-lg font-bold text-ink">3. Mode</h2>
            <div role="radiogroup" aria-label="Practice mode" className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" role="radio" aria-checked={mode === "demo"} onClick={() => setMode("demo")} className={cn("glass press rounded-[20px] p-4 text-left", mode === "demo" && "glass-selected")}>
                <span className="flex items-center gap-2 font-semibold text-ink"><ScrollText className="h-4 w-4 text-violet" aria-hidden /> Demo mode</span>
                <span className="mt-1 block text-sm text-ink-soft">Curated, branching conversations with scripted sample coaching. Works offline.</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "ai"}
                disabled={!services?.ai}
                onClick={() => setMode("ai")}
                className={cn("glass press rounded-[20px] p-4 text-left disabled:cursor-not-allowed disabled:opacity-60", mode === "ai" && "glass-selected")}
              >
                <span className="flex items-center gap-2 font-semibold text-ink"><Bot className="h-4 w-4 text-violet" aria-hidden /> Connected AI</span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {services === null ? "Checking availability…" : services.ai ? `Live responses via ${services.provider}.` : "Not configured on this site. Requires a server-side AI key."}
                </span>
              </button>
            </div>
            <GlassButton variant="primary" size="lg" className="mt-8 w-full sm:w-auto" icon={<Play className="h-5 w-5" aria-hidden />} onClick={() => { const h = level !== "intermediate"; setHints(h); start(h); }}>
              Start conversation
            </GlassButton>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard>
              <div className="flex items-center gap-3">
                <MiraAvatar className="h-12 w-12" />
                <div>
                  <p className="font-bold text-ink">{topic.title}</p>
                  <p className="text-sm text-ink-soft">{topic.scenario}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                <li>• {topic.turns.length} exchanges</li>
                <li>• Useful phrases you can save</li>
                <li>• Session recap at the end</li>
              </ul>
            </GlassCard>
            <GlassCard>
              <p className="flex items-center gap-2 font-semibold text-ink"><Info className="h-4 w-4 text-violet" aria-hidden /> About microphone input</p>
              <p className="mt-2 text-sm text-ink-soft">{mic.supported ? SPEECH_PRIVACY_NOTE : micErrorText.unsupported.en}</p>
              <p className="mt-2 text-sm text-ink-soft">The microphone turns on only when you tap the mic button, and turns off when you stop or end the session.</p>
            </GlassCard>
            <GlassCard>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-semibold text-ink"><Users className="h-4 w-4 text-violet" aria-hidden /> Speaking partner</p>
                <Pill tone="warn">Coming soon</Pill>
              </div>
              <p className="mt-2 text-sm text-ink-soft">Practise with another learner. Matching and calling aren’t available yet.</p>
              <GlassButton size="sm" variant="ghost" className="mt-3" onClick={() => setPartnerOpen(true)}>Learn more</GlassButton>
            </GlassCard>
          </div>
        </div>
      )}

      {phase === "active" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <GlassCard padding="none" className="flex min-h-[32rem] flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--glass-edge)] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <MiraAvatar className="h-10 w-10" speaking={busy} />
                <div>
                  <p className="font-bold text-ink">{topic.title}</p>
                  {mode === "demo" ? <Pill tone="warn">Demo · scripted replies</Pill> : <Pill tone="violet">Connected AI</Pill>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <GlassButton size="icon" variant="ghost" aria-label="Replay Mira’s last message" disabled={!lastTutor || !tts} onClick={() => lastTutor && speak(lastTutor.en, { rate })}>
                  <RotateCcw className="h-4 w-4" aria-hidden />
                </GlassButton>
                <GlassButton size="icon" variant="ghost" aria-label="Stop audio and microphone" onClick={() => { stopSpeaking(); mic.cancel(); }}>
                  <Square className="h-4 w-4" aria-hidden />
                </GlassButton>
                <GlassButton size="sm" variant="danger" onClick={end} icon={<LogOut className="h-4 w-4" aria-hidden />}>End</GlassButton>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5" aria-live="polite" aria-label="Conversation">
              {msgs.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col", m.from === "you" ? "items-end" : "items-start")}>
                  <div className={cn("flex max-w-[88%] items-end gap-2", m.from === "you" && "flex-row-reverse")}>
                    <div className={cn("rounded-[20px] px-4 py-2.5", m.from === "tutor" ? "glass-inset rounded-tl-md text-ink" : "glass-primary rounded-tr-md")}>
                      <p className="sr-only">{m.from === "tutor" ? "Mira says:" : "You said:"}</p>
                      <p>{m.en}</p>
                      {m.from === "tutor" && hints && m.hi && <p lang="hi" className="hi mt-1 text-sm text-ink-soft">{m.hi}</p>}
                    </div>
                    {m.from === "tutor" && <SpeakButton text={m.en} />}
                  </div>
                  {m.coach && (
                    <p className="mt-1.5 max-w-[88%] rounded-2xl bg-warn-soft px-3 py-2 text-sm text-ink-soft">
                      <span className="font-semibold text-warn">Sample coaching (scripted): </span>
                      {m.coach}
                    </p>
                  )}
                </motion.div>
              ))}
              {busy && <p className="text-sm text-ink-mute" role="status">Mira is replying…</p>}
              {aiError && (
                <div role="alert" className="rounded-2xl bg-danger-soft p-3 text-sm text-danger">
                  {aiError}{" "}
                  <button type="button" className="min-h-11 font-semibold underline" onClick={() => { setMode("demo"); setPhase("setup"); }}>Switch to demo mode</button>
                </div>
              )}
              {demoDone && (
                <div className="glass-inset rounded-2xl p-4 text-center">
                  <p className="font-semibold text-ink">Conversation complete!</p>
                  <GlassButton variant="primary" className="mt-3" onClick={end}>See session recap</GlassButton>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-[var(--glass-edge)] px-4 py-4 sm:px-5">
              {current && hints && (
                <div className="space-y-2">
                  <p lang="hi" className="hi flex gap-2 text-sm text-ink-soft"><Lightbulb className="mt-1 h-4 w-4 shrink-0 text-violet" aria-hidden />{current.hint}</p>
                  <div className="flex flex-wrap gap-2" aria-label="Suggested replies">
                    {current.suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => send(s)} className="glass-inset press min-h-11 rounded-full px-3 text-left text-sm text-ink-soft hover:text-ink">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {!demoDone && (
                <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                  {mic.supported && <MicButton size="md" state={mic.state} onStart={mic.start} onStop={mic.stop} disabled={busy} />}
                  <label htmlFor="reply" className="sr-only">Your reply</label>
                  <input
                    id="reply"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={busy}
                    placeholder={mic.state === "listening" ? "Listening…" : "Type your reply in English"}
                    className="glass-inset min-h-12 w-full min-w-0 rounded-full px-4 text-ink outline-none placeholder:text-ink-mute"
                    autoComplete="off"
                  />
                  <button type="submit" aria-label="Send" disabled={busy || !input.trim()} className="glass-primary press grid h-12 w-12 shrink-0 place-items-center rounded-full disabled:opacity-50">
                    <Send className="h-5 w-5" aria-hidden />
                  </button>
                </form>
              )}
              <p role="status" className="text-xs text-ink-mute">
                {mic.state === "error" && mic.error ? micErrorText[mic.error].en : mic.state === "listening" && mic.interim ? `Hearing: “${mic.interim}”` : mic.supported ? micStatusText[mic.state] : "Speech input not supported here — typing works."}
              </p>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard>
              <h2 className="font-bold text-ink">Controls</h2>
              <div className="mt-3 space-y-3">
                <button type="button" role="switch" aria-checked={hints} onClick={() => setHints((h) => !h)} className={cn("glass-inset press flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-sm font-semibold", hints ? "glass-selected text-violet" : "text-ink-soft")}>
                  <span className="flex items-center gap-2"><Languages className="h-4 w-4" aria-hidden /> Hindi hints & suggestions</span>
                  <span>{hints ? "On" : "Off"}</span>
                </button>
                <button type="button" role="switch" aria-checked={readAloud} disabled={!tts} onClick={() => setReadAloud((r) => !r)} className={cn("glass-inset press flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-sm font-semibold disabled:opacity-50", readAloud ? "glass-selected text-violet" : "text-ink-soft")}>
                  <span className="flex items-center gap-2"><Volume2 className="h-4 w-4" aria-hidden /> Read Mira’s replies aloud</span>
                  <span>{readAloud ? "On" : "Off"}</span>
                </button>
                <div>
                  <label htmlFor="rate" className="flex items-center justify-between text-sm font-semibold text-ink-soft">
                    <span className="flex items-center gap-2"><Gauge className="h-4 w-4" aria-hidden /> Speech speed</span>
                    <span>{rate.toFixed(2)}×</span>
                  </label>
                  <input id="rate" type="range" min={0.6} max={1.2} step={0.05} value={rate} onChange={(e) => actions.updatePrefs({ speechRate: Number(e.target.value) })} className="mt-2 h-11 w-full accent-[var(--violet)]" />
                </div>
              </div>
            </GlassCard>
            {mode === "demo" && (
              <GlassCard>
                <h2 className="font-bold text-ink">Useful phrases</h2>
                <ul className="mt-3 space-y-2">
                  {usedTurns.map((t) => (
                    <li key={t.usefulPhrase.en} className="glass-inset flex items-center justify-between gap-2 rounded-2xl p-3">
                      <span>
                        <span className="block text-sm font-semibold text-ink">{t.usefulPhrase.en}</span>
                        <span lang="hi" className="hi block text-xs text-ink-mute">{t.usefulPhrase.hi}</span>
                      </span>
                      <GlassButton size="icon" variant="ghost" aria-label={`Save phrase: ${t.usefulPhrase.en}`} pressed={saved.includes(t.usefulPhrase.en)} onClick={() => savePhrase(t.usefulPhrase.en, t.usefulPhrase.hi)}>
                        {saved.includes(t.usefulPhrase.en) ? <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                      </GlassButton>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
            <p className="px-1 text-xs text-ink-mute">
              Pronunciation scores aren’t shown: no pronunciation assessment service is connected, and a transcript alone can’t measure how you sounded.
            </p>
          </div>
        </div>
      )}

      {phase === "ended" && (
        <GlassCard padding="lg" className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-ink">Session recap</h2>
          <p lang="hi" className="hi text-ink-soft">आज की बातचीत का सारांश</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ["Your replies", msgs.filter((m) => m.from === "you").length],
              [mode === "demo" ? "Exchanges" : "Mira’s replies", mode === "demo" ? Math.min(turn, topic.turns.length) : msgs.filter((m) => m.from === "tutor").length],
              ["Phrases saved", saved.length],
            ].map(([k, v]) => (
              <GlassCard nested key={k as string} padding="sm">
                <p className="text-2xl font-bold text-ink">{v}</p>
                <p className="text-xs text-ink-soft">{k}</p>
              </GlassCard>
            ))}
          </div>
          {msgs.filter((m) => m.from === "you").length === 0 && <p className="mt-4 text-sm text-ink-soft">You didn’t reply this time, so the session wasn’t saved to your history.</p>}
          {mode === "demo" && (
            <>
              <h3 className="mt-6 font-semibold text-ink">Phrases from this topic</h3>
              <ul className="mt-2 space-y-2">
                {topic.turns.map((t) => (
                  <li key={t.usefulPhrase.en} className="glass-inset flex items-center justify-between gap-2 rounded-2xl p-3">
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.usefulPhrase.en}</span>
                      <span lang="hi" className="hi block text-xs text-ink-mute">{t.usefulPhrase.hi}</span>
                    </span>
                    <span className="flex gap-1.5">
                      <SpeakButton text={t.usefulPhrase.en.replace(/…/g, "")} />
                      <GlassButton size="icon" variant="ghost" aria-label={`Save phrase: ${t.usefulPhrase.en}`} pressed={saved.includes(t.usefulPhrase.en)} onClick={() => savePhrase(t.usefulPhrase.en, t.usefulPhrase.hi)}>
                        {saved.includes(t.usefulPhrase.en) ? <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                      </GlassButton>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <GlassButton variant="primary" onClick={() => start()} icon={<RotateCcw className="h-4 w-4" aria-hidden />}>Practise again</GlassButton>
            <GlassButton onClick={() => setPhase("setup")}>Choose another topic</GlassButton>
            <GlassLink href="/vocabulary?tab=saved" variant="ghost">View saved phrases</GlassLink>
          </div>
        </GlassCard>
      )}

      <GlassModal
        open={partnerOpen}
        onClose={() => setPartnerOpen(false)}
        title="Speaking partner — coming soon"
        description="This feature isn’t live yet."
        footer={<GlassButton variant="primary" onClick={() => setPartnerOpen(false)}>Got it</GlassButton>}
      >
        <p>We plan to let learners practise with each other. Real matchmaking and calling are not implemented in this version, so we don’t simulate a connection to another person. Until then, practise with Mira’s demo conversations.</p>
      </GlassModal>
    </Container>
  );
}
