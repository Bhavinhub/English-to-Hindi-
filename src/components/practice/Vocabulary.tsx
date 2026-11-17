"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, BookmarkCheck, Check, Layers, Search, SearchX, Trash2, Repeat, PartyPopper } from "lucide-react";
import { GlassButton, GlassCard, GlassInput, GlassTabs, GlassLink } from "@/components/glass";
import { Container, EmptyState, PageHeader, Pill, SpeakButton } from "@/components/common/ui";
import { words, wordTopics, type Word } from "@/data/vocabulary";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

type Tab = "review" | "all" | "saved";

function Flashcard({ word, onAnswer, autoFocus }: { word: Word; onAnswer: (gotIt: boolean) => void; autoFocus?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  // a new card takes focus after an answer; flipping moves focus to the meaning side
  useEffect(() => {
    if (autoFocus) frontRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  useEffect(() => {
    if (flipped) backRef.current?.focus({ preventScroll: true });
  }, [flipped]);
  const { state, actions } = useStore();
  const saved = state.savedWords.includes(word.id);
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flip-scene">
        <div className="flip-card relative h-72 sm:h-80" data-flipped={flipped}>
          <button
            ref={frontRef}
            type="button"
            onClick={() => setFlipped(true)}
            aria-label={`Flashcard: ${word.word}. Tap to see the meaning.`}
            aria-hidden={flipped}
            tabIndex={flipped ? -1 : 0}
            inert={flipped}
            className="flip-face glass glass-strong absolute inset-0 flex flex-col items-center justify-center rounded-[28px] p-6 text-center"
          >
            <Pill className="absolute left-5 top-5">{word.pos}</Pill>
            <p className="text-4xl font-bold text-ink sm:text-5xl">{word.word}</p>
            <p className="mt-4 text-sm text-ink-mute">Tap to reveal meaning</p>
          </button>
          <div ref={backRef} tabIndex={-1} aria-live="polite" className="flip-face flip-back glass glass-strong absolute inset-0 flex flex-col justify-center rounded-[28px] p-6 outline-none" aria-hidden={!flipped} inert={!flipped}>
            <p className="text-2xl font-bold text-ink">{word.word}</p>
            <p lang="hi" className="hi text-xl text-violet">{word.hi}</p>
            <p className="mt-4 text-ink">“{word.example}”</p>
            <p lang="hi" className="hi text-sm text-ink-soft">{word.exampleHi}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <SpeakButton text={word.word} label={word.word} />
        <SpeakButton text={word.example} size="sm" label="example sentence" />
        <GlassButton size="icon" variant="ghost" aria-label={saved ? `Remove ${word.word} from saved` : `Save ${word.word}`} pressed={saved} onClick={() => actions.toggleWord(word.id)}>
          {saved ? <BookmarkCheck className="h-5 w-5 text-violet" aria-hidden /> : <Bookmark className="h-5 w-5" aria-hidden />}
        </GlassButton>
        {!flipped && <GlassButton size="sm" onClick={() => setFlipped(true)}>Show meaning</GlassButton>}
      </div>
      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <GlassButton size="lg" onClick={() => onAnswer(false)} icon={<Repeat className="h-5 w-5" aria-hidden />}>Review Again</GlassButton>
          <GlassButton size="lg" variant="primary" onClick={() => onAnswer(true)} icon={<Check className="h-5 w-5" aria-hidden />}>Got It</GlassButton>
        </div>
      )}
    </div>
  );
}

function ReviewDeck() {
  const { hydrated } = useStore();
  return hydrated ? <ReviewDeckInner /> : null;
}

function ReviewDeckInner() {
  const { state, actions } = useStore();
  const [onlySaved, setOnlySaved] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  // refreshed after every answer so "Review Again" cards (due in ~10 min) can come back this session
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const queue = useMemo(() => {
    const pool = onlySaved ? words.filter((w) => state.savedWords.includes(w.id)) : words;
    const due = pool.filter((w) => {
      const r = state.reviews[w.id];
      return !r || new Date(r.due).getTime() <= now;
    });
    // saved words first, then never-reviewed, then oldest due
    return due.sort((a, b) => {
      const sa = state.savedWords.includes(a.id) ? 0 : 1;
      const sb = state.savedWords.includes(b.id) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      const ra = state.reviews[a.id]?.due ?? "";
      const rb = state.reviews[b.id]?.due ?? "";
      return ra.localeCompare(rb);
    });
  }, [state.reviews, state.savedWords, onlySaved, now]);

  const word = queue[0];
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft" role="status">
          <span className="font-semibold text-ink">{queue.length}</span> cards due · {sessionCount} reviewed this session
        </p>
        <button type="button" role="switch" aria-checked={onlySaved} onClick={() => setOnlySaved((v) => !v)} className={cn("glass-inset press min-h-11 rounded-full px-4 text-sm font-semibold", onlySaved ? "glass-selected text-violet" : "text-ink-soft")}>
          Only saved words
        </button>
      </div>
      {word ? (
        <Flashcard
          key={word.id + sessionCount}
          word={word}
          autoFocus={sessionCount > 0}
          onAnswer={(got) => {
            actions.reviewWord(word.id, got);
            setSessionCount((c) => c + 1);
            setNow(Date.now());
          }}
        />
      ) : (
        <EmptyState icon={<PartyPopper className="h-6 w-6" aria-hidden />} title={onlySaved && state.savedWords.length === 0 ? "No saved words yet" : "All caught up!"}>
          {onlySaved && state.savedWords.length === 0
            ? "Save words from the All words tab to build your own deck."
            : "Cards you marked “Got It” come back after 1, 2, 4, 7 and 14 days. Come back later for more."}
        </EmptyState>
      )}
      <p className="mt-6 text-center text-xs text-ink-mute">“Review Again” brings a card back in about 10 minutes; “Got It” spaces it out further each time.</p>
    </div>
  );
}

function WordRow({ w }: { w: Word }) {
  const { state, actions } = useStore();
  const saved = state.savedWords.includes(w.id);
  const r = state.reviews[w.id];
  return (
    <GlassCard nested padding="sm" className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{w.word} <span className="text-xs font-normal text-ink-mute">· {w.pos}</span></p>
        <p lang="hi" className="hi text-violet">{w.hi}</p>
        <p className="text-sm text-ink-soft">{w.example}</p>
        {r && <p className="mt-1 text-xs text-ink-mute">Reviewed {r.reviews}× · box {r.box}/5</p>}
      </div>
      <SpeakButton text={w.word} label={w.word} />
      <GlassButton size="icon" variant="ghost" aria-label={saved ? `Remove ${w.word} from saved` : `Save ${w.word}`} pressed={saved} onClick={() => actions.toggleWord(w.id)}>
        {saved ? <BookmarkCheck className="h-5 w-5 text-violet" aria-hidden /> : <Bookmark className="h-5 w-5" aria-hidden />}
      </GlassButton>
    </GlassCard>
  );
}

function AllWords() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const list = words.filter((w) => {
    if (topic !== "All" && w.topic !== topic) return false;
    const n = q.trim().toLowerCase();
    return !n || `${w.word} ${w.hi} ${w.example}`.toLowerCase().includes(n);
  });
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="relative md:max-w-sm md:flex-1">
          <Search className="pointer-events-none absolute left-4 top-[2.85rem] z-10 h-4 w-4 text-ink-mute" aria-hidden />
          <GlassInput id="word-search" type="search" label="Search words (English or Hindi)" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. nervous, उधार" className="pl-10" />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {["All", ...wordTopics].map((t) => (
            <button key={t} type="button" aria-pressed={t === topic} onClick={() => setTopic(t)} className={cn("glass-inset press min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold", t === topic ? "glass-selected text-violet" : "text-ink-soft")}>{t}</button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">{list.length} words</p>
      {list.length === 0 ? (
        <EmptyState icon={<SearchX className="h-6 w-6" aria-hidden />} title="No words found">Try another search.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {list.map((w) => <li key={w.id}><WordRow w={w} /></li>)}
        </ul>
      )}
    </div>
  );
}

function Saved() {
  const { state, actions } = useStore();
  const savedWords = words.filter((w) => state.savedWords.includes(w.id));
  if (savedWords.length === 0 && state.savedPhrases.length === 0)
    return (
      <EmptyState icon={<Bookmark className="h-6 w-6" aria-hidden />} title="Nothing saved yet" action={<GlassLink href="/translate" variant="primary" size="sm">Find phrases to save</GlassLink>}>
        Save words here, phrases from lessons, the translator or speaking practice.
      </EmptyState>
    );
  return (
    <div className="space-y-8">
      <section aria-labelledby="sw">
        <h2 id="sw" className="mb-3 font-bold text-ink">Saved words ({savedWords.length})</h2>
        {savedWords.length ? <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">{savedWords.map((w) => <li key={w.id}><WordRow w={w} /></li>)}</ul> : <p className="text-sm text-ink-soft">No saved words yet.</p>}
      </section>
      <section aria-labelledby="sp">
        <h2 id="sp" className="mb-3 font-bold text-ink">Saved phrases ({state.savedPhrases.length})</h2>
        {state.savedPhrases.length ? (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {state.savedPhrases.map((p) => (
              <li key={p.id}>
                <GlassCard nested padding="sm" className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{p.en}</p>
                    {p.hi && <p lang="hi" className="hi text-sm text-ink-soft">{p.hi}</p>}
                    <p className="text-xs text-ink-mute">From {p.source}</p>
                  </div>
                  <SpeakButton text={p.en.replace(/…/g, "")} />
                  <GlassButton size="icon" variant="ghost" aria-label={`Remove phrase: ${p.en}`} onClick={() => actions.removePhrase(p.id)}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </GlassButton>
                </GlassCard>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft">No saved phrases yet.</p>
        )}
      </section>
    </div>
  );
}

export function Vocabulary() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = (["review", "all", "saved"] as const).find((t) => t === params.get("tab")) ?? "review";
  const [tab, setTab] = useState<Tab>(initial);
  const { state } = useStore();
  return (
    <Container>
      <PageHeader eyebrow="Vocabulary" title="Words in context" hi="संदर्भ में शब्द">
        {words.length} useful words with Hindi meanings, examples and audio. Review with spaced repetition.
      </PageHeader>
      <GlassTabs
        label="Vocabulary sections"
        idPrefix="voc"
        value={tab}
        onChange={(t) => { setTab(t); router.replace(`/vocabulary?tab=${t}`, { scroll: false }); }}
        className="mb-6"
        tabs={[
          { id: "review", label: <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" aria-hidden /> Review</span> },
          { id: "all", label: "All words" },
          { id: "saved", label: `Saved (${state.savedWords.length + state.savedPhrases.length})` },
        ]}
      />
      <div role="tabpanel" id={`voc-panel-${tab}`} aria-labelledby={`voc-tab-${tab}`}>
        {tab === "review" && <ReviewDeck />}
        {tab === "all" && <AllWords />}
        {tab === "saved" && <Saved />}
      </div>
    </Container>
  );
}
