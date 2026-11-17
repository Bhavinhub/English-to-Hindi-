"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Languages, Send, Info } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { MiraAvatar } from "./MiraAvatar";
import { MicButton, micStatusText } from "@/components/common/MicButton";
import { SpeakButton } from "@/components/common/ui";
import { useSpeechRecognition, micErrorText } from "@/lib/speech";
import { getTopic } from "@/data/conversations";
import { cn } from "@/lib/cn";
import { tutorReply } from "@/lib/demo-engine";

type Msg = { id: number; from: "tutor" | "you"; en: string; hi?: string };
let nextId = 1;
const topic = getTopic("introductions")!;

export function TutorPreview() {
  const [hindi, setHindi] = useState(true);
  const [turn, setTurn] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "tutor", ...topic.turns[0].tutor }]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  function reply(said: string) {
    const clean = said.trim();
    if (!clean || turn >= topic.turns.length) return;
    const answer = tutorReply(topic, turn, clean);
    setMsgs((m) => [...m, { id: nextId++, from: "you" as const, en: clean }, { id: nextId++, from: "tutor" as const, ...answer }].slice(-6));
    setTurn(turn + 1);
    setText("");
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: 9999, behavior: "smooth" }));
  }

  const mic = useSpeechRecognition(reply);
  const done = turn >= topic.turns.length;
  const micCancel = mic.cancel;
  useEffect(() => {
    if (done) micCancel();
  }, [done, micCancel]);
  const suggestions = done ? [] : topic.turns[turn].suggestions;

  return (
    <GlassCard strong padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--glass-edge)] px-5 py-4">
        <div className="flex items-center gap-3">
          <MiraAvatar className="h-11 w-11" speaking={mic.state === "processing"} />
          <div>
            <p className="font-bold text-ink">Mira</p>
            <p className="text-xs text-ink-mute">Practice tutor · Demo (scripted)</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hindi}
          onClick={() => setHindi((h) => !h)}
          className={cn("press inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold", hindi ? "glass-selected glass-inset text-violet" : "glass-inset text-ink-soft")}
        >
          <Languages className="h-4 w-4" aria-hidden />
          Hindi help {hindi ? "on" : "off"}
        </button>
      </div>

      <div ref={listRef} className="h-72 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite" aria-label="Conversation transcript">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2", m.from === "you" && "justify-end")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-[20px] px-4 py-2.5 text-[0.95rem]",
                  m.from === "tutor" ? "glass-inset rounded-tl-md text-ink" : "glass-primary rounded-tr-md",
                )}
              >
                <p>{m.en}</p>
                {m.from === "tutor" && hindi && m.hi && (
                  <p lang="hi" className="hi mt-1 text-sm text-ink-soft">
                    {m.hi}
                  </p>
                )}
              </div>
              {m.from === "tutor" && <SpeakButton text={m.en} className="self-end" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-3 border-t border-[var(--glass-edge)] px-5 py-4">
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Suggested replies">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => reply(s)} className="glass-inset press min-h-11 rounded-full px-3 text-left text-sm text-ink-soft hover:text-ink">
                {s}
              </button>
            ))}
          </div>
        )}
        {done ? (
          <p className="text-sm text-ink-soft">That’s the end of this sample. Open full practice for more topics.</p>
        ) : (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              reply(text);
            }}
          >
            {mic.supported && <MicButton size="md" state={mic.state} onStart={mic.start} onStop={mic.stop} />}
            <label htmlFor="hero-reply" className="sr-only">
              Type your reply
            </label>
            <input
              id="hero-reply"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={mic.state === "listening" ? "Listening…" : "Type your reply in English"}
              className="glass-inset min-h-12 w-full min-w-0 rounded-full px-4 text-ink outline-none placeholder:text-ink-mute"
            />
            <button type="submit" aria-label="Send reply" className="glass-primary press grid h-12 w-12 shrink-0 place-items-center rounded-full">
              <Send className="h-5 w-5" aria-hidden />
            </button>
          </form>
        )}
        <p className="flex items-start gap-1.5 text-xs text-ink-mute" role="status">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {mic.state === "error" && mic.error
            ? micErrorText[mic.error].en
            : mic.state === "listening" && mic.interim
              ? `Hearing: “${mic.interim}”`
              : mic.supported
              ? `${micStatusText[mic.state]}. Mic starts only when you tap it.`
              : "Speech input isn’t supported in this browser — typing works everywhere."}
        </p>
      </div>
    </GlassCard>
  );
}
