"use client";
import { useMemo, useState } from "react";
import { ArrowRight, BookmarkPlus, CheckCircle2, Eye, Info, RotateCcw, Search, Shuffle, SkipForward } from "lucide-react";
import { GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/glass";
import { Container, CopyButton, PageHeader, Pill, SpeakButton } from "@/components/common/ui";
import { phrases, type Phrase } from "@/data/phrases";
import { checkAnswer, normalize, similarity } from "@/lib/answers";
import { useStore } from "@/lib/store";
import { useServiceStatus } from "@/lib/services";
import { cn } from "@/lib/cn";

type Result = { en: string; alts: string[]; explanation: string; explanationHi?: string; hi?: string; source: "curated" | "service" };

const normHi = (s: string) => s.replace(/[।?!,.\s]+/g, " ").trim();

/** Negation flips meaning, so a match must agree on it ("समझ आया" ≠ "समझ नहीं आया"). */
const NEG_DEVA = /(^|\s)(नहीं|नही|न|ना|मत)(\s|$)/;
const NEG_ROMAN = /\b(nahi|nahin|nahee|nai|na|mat)\b/;
const hasNegation = (s: string, deva: boolean) => (deva ? NEG_DEVA.test(normHi(s)) : NEG_ROMAN.test(normalize(s)));

function findPhrase(input: string): { match: Phrase | null; near: Phrase[] } {
  const raw = input.trim();
  if (!raw) return { match: null, near: [] };
  const isDeva = /[\u0900-\u097F]/.test(raw);
  const neg = hasNegation(raw, isDeva);
  const scored = phrases.map((p) => {
    const s = isDeva ? similarity(normHi(raw), normHi(p.hi)) : Math.max(...p.roman.map((r) => similarity(normalize(raw), r)));
    const sameNeg = isDeva ? hasNegation(p.hi, true) === neg : p.roman.some((r) => hasNegation(r, false) === neg);
    return { p, s, sameNeg };
  });
  scored.sort((a, b) => b.s - a.s);
  const best = scored.find((x) => x.sameNeg);
  return {
    match: best && best.s >= 0.85 ? best.p : null,
    near: scored.slice(0, 3).filter((x) => x.s > 0.35).map((x) => x.p),
  };
}

function ResultCard({ r, onTryAgain }: { r: Result; onTryAgain: () => void }) {
  const { state, actions } = useStore();
  const saved = state.savedPhrases.find((p) => p.en.toLowerCase() === r.en.toLowerCase());
  const isSaved = !!saved;
  return (
    <GlassCard nested className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet">Natural English</p>
        {r.source === "service" && <Pill tone="violet">From connected service</Pill>}
      </div>
      <p className="mt-1 text-2xl font-semibold text-ink">{r.en}</p>
      {r.alts.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-ink-soft">Other ways to say it</p>
          <ul className="mt-1 space-y-1">
            {r.alts.map((a) => (
              <li key={a} className="text-ink-soft">• {a}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 rounded-2xl bg-violet-soft p-3">
        <p className="flex gap-2 text-sm text-ink"><Info className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden />{r.explanation}</p>
        {r.explanationHi && <p lang="hi" className="hi pl-6 text-sm text-ink-soft">{r.explanationHi}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SpeakButton text={r.en} size="sm" />
        <CopyButton text={r.en} />
        <GlassButton size="sm" variant="ghost" pressed={isSaved} onClick={() => (saved ? actions.removePhrase(saved.id) : actions.savePhrase({ en: r.en, hi: r.hi ?? "", source: "translate" }))} icon={isSaved ? <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}>
          {isSaved ? "Saved (tap to remove)" : "Save"}
        </GlassButton>
        <GlassButton size="sm" variant="ghost" onClick={onTryAgain} icon={<RotateCcw className="h-4 w-4" aria-hidden />}>Try again</GlassButton>
      </div>
    </GlassCard>
  );
}

function LookupMode() {
  const services = useServiceStatus();
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [near, setNear] = useState<Phrase[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState<string>("All");

  const show = (p: Phrase) => {
    setText(p.hi);
    setResult({ en: p.en, alts: p.alts, explanation: p.explanation, explanationHi: p.explanationHi, hi: p.hi, source: "curated" });
    setNotFound(false);
    setNear([]);
    setError(null);
  };

  async function submit() {
    setError(null);
    const { match, near } = findPhrase(text);
    if (match) return show(match);
    setResult(null);
    setNear(near);
    if (services?.translate) {
      setLoading(true);
      try {
        const res = await fetch("/api/translate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResult({ en: data.en, alts: data.alts ?? [], explanation: data.explanation ?? "", explanationHi: data.explanationHi, hi: text, source: "service" });
        setNotFound(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Translation failed.");
      } finally {
        setLoading(false);
      }
    } else {
      setNotFound(true);
    }
  }

  const cats = ["All", ...Array.from(new Set(phrases.map((p) => p.category)))];
  const list = cat === "All" ? phrases : phrases.filter((p) => p.category === cat);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <GlassCard padding="lg">
        <form onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          <GlassInput
            id="hi-input"
            label="Hindi sentence (Devanagari or Romanized)"
            hint="Examples: मुझे अंग्रेज़ी सीखनी है।  ·  mujhe angrezi seekhni hai"
            value={text}
            onChange={(e) => { setText(e.target.value); setNotFound(false); }}
            lang="hi"
            className="hi text-lg"
            autoComplete="off"
          />
          <GlassButton type="submit" variant="primary" className="mt-3" loading={loading} disabled={!text.trim()} icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Show natural English
          </GlassButton>
        </form>
        <div aria-live="polite">
          {result && <ResultCard r={result} onTryAgain={() => { setResult(null); setText(""); }} />}
          {error && <p role="alert" className="mt-4 rounded-2xl bg-danger-soft p-3 text-sm text-danger">{error}</p>}
          {notFound && (
            <div className="mt-5 rounded-2xl bg-warn-soft p-4 text-sm">
              <p className="font-semibold text-warn">This sentence isn’t in our curated set yet.</p>
              <p className="mt-1 text-ink-soft">
                In demo mode we only show translations that have been checked by hand. Translating any sentence requires a connected translation service, which isn’t configured on this site.
              </p>
              {near.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-ink">Did you mean one of these?</p>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {near.map((p) => (
                      <li key={p.id}>
                        <button type="button" lang="hi" onClick={() => show(p)} className="glass-inset press hi min-h-11 rounded-full px-3 text-ink">{p.hi}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-bold text-ink">Browse {phrases.length} curated examples</h2>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn("glass-inset press min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold", c === cat ? "glass-selected text-violet" : "text-ink-soft")}>{c}</button>
          ))}
        </div>
        <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => show(p)} className="glass-inset press w-full rounded-2xl p-3 text-left hover:border-[var(--violet)]">
                <span lang="hi" className="hi block text-ink">{p.hi}</span>
                <span className="block text-xs text-ink-mute">{p.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function ChallengeMode() {
  const { state, actions } = useStore();
  const order = useMemo(() => phrases.map((_, i) => i), []);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [res, setRes] = useState<ReturnType<typeof checkAnswer> | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [peeked, setPeeked] = useState(false);
  const p = phrases[order[idx % order.length]];

  const next = (random = false) => {
    setIdx((i) => (random ? Math.floor(Math.random() * phrases.length) : i + 1));
    setValue("");
    setRes(null);
    setRevealed(false);
    setPeeked(false);
  };

  return (
    <GlassCard padding="lg" className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-2">
        <Pill>{p.category}</Pill>
        <p className="text-sm text-ink-soft">Correct so far: <span className="font-semibold text-ink">{state.translations.correct}</span> / {state.translations.attempts}</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-ink-soft">How would you say this in English?</p>
      <p lang="hi" className="hi mt-1 text-2xl font-semibold text-ink">{p.hi}</p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim() || res) return;
          const r = checkAnswer(value, [p.en, ...p.alts, ...p.accept]);
          setRes(r);
          setPeeked(revealed);
          setRevealed(true);
          // an answer typed after looking at the solution doesn't count as correct
          actions.recordTranslation(r.status === "correct" && !revealed);
        }}
      >
        <GlassInput id="challenge" label="Your English" hideLabel value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type your English answer" autoComplete="off" disabled={!!res} />
        <GlassButton type="submit" variant="primary" disabled={!value.trim() || !!res}>Check</GlassButton>
      </form>
      {!res && !revealed && <p className="mt-2 text-xs text-ink-mute">The answer stays hidden until you try.</p>}
      <div aria-live="polite">
        {res && (
          <div className={cn("mt-4 rounded-2xl p-4", res.status === "correct" ? "bg-success-soft" : res.status === "close" ? "bg-warn-soft" : "bg-danger-soft")}>
            <p className={cn("font-semibold", res.status === "correct" ? "text-success" : res.status === "close" ? "text-warn" : "text-danger")}>
              {res.status === "correct" ? (peeked ? "Correct — but you looked first, so it isn’t counted. Try the next one!" : "Correct — natural English!") : res.status === "close" ? "Very close!" : "Good try — here’s a natural way to say it."}
            </p>
            <p className="mt-1 text-lg font-semibold text-ink">{p.en}</p>
            {p.alts.length > 0 && <p className="text-sm text-ink-soft">Also correct: {p.alts.join(" · ")}</p>}
            <p className="mt-2 text-sm text-ink-soft">{p.explanation}</p>
            <p lang="hi" className="hi text-sm text-ink-mute">{p.explanationHi}</p>
            <div className="mt-3 flex flex-wrap gap-2"><SpeakButton text={p.en} size="sm" /><CopyButton text={p.en} /></div>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {!res && (
          <GlassButton variant="ghost" onClick={() => setRevealed(true)} disabled={revealed} icon={<Eye className="h-4 w-4" aria-hidden />}>
            {revealed ? p.en : "I give up — show answer"}
          </GlassButton>
        )}
        <GlassButton variant={res ? "primary" : "ghost"} onClick={() => next()} icon={<SkipForward className="h-4 w-4" aria-hidden />}>Next sentence</GlassButton>
        <GlassButton variant="ghost" onClick={() => next(true)} icon={<Shuffle className="h-4 w-4" aria-hidden />}>Random</GlassButton>
      </div>
    </GlassCard>
  );
}

export function Translator() {
  const [tab, setTab] = useState<"lookup" | "challenge">("lookup");
  return (
    <Container>
      <PageHeader eyebrow="Hindi → English" title="Say it naturally in English" hi="हिंदी से स्वाभाविक अंग्रेज़ी">
        Learn meaning and context, not just word-for-word translation.
      </PageHeader>
      <GlassTabs
        label="Translate mode"
        idPrefix="tr"
        value={tab}
        onChange={setTab}
        className="mb-6"
        tabs={[
          { id: "lookup", label: <span className="flex items-center gap-1.5"><Search className="h-4 w-4" aria-hidden /> Look up</span> },
          { id: "challenge", label: <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" aria-hidden /> Practice challenge</span> },
        ]}
      />
      <div role="tabpanel" id={`tr-panel-${tab}`} aria-labelledby={`tr-tab-${tab}`}>
        {tab === "lookup" ? <LookupMode /> : <ChallengeMode />}
      </div>
    </Container>
  );
}
