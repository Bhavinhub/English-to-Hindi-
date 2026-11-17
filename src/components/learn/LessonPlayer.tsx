"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Lightbulb, MessageCircle, Mic, PartyPopper, Plus, Target, Info,
} from "lucide-react";
import { GlassButton, GlassCard, GlassLink, GlassTextarea } from "@/components/glass";
import { Container, Explain, Pill, ProgressBar, SpeakButton } from "@/components/common/ui";
import { MicButton, micStatusText } from "@/components/common/MicButton";
import { ChoiceQuestion, PatternQuestion, TranslateQuestion, type Outcome } from "./Exercise";
import { getLesson } from "@/data/lessons";
import { courseForLesson, courses } from "@/data/courses";
import { useStore } from "@/lib/store";
import { micErrorText, SPEECH_PRIVACY_NOTE, useSpeechRecognition } from "@/lib/speech";
import { cn } from "@/lib/cn";

const SECTIONS = ["Goal", "Examples", "Pattern", "Dialogue", "Practice", "Speak", "Recap"] as const;

function nextLessonId(id: string) {
  const c = courseForLesson(id)!;
  const i = c.lessonIds.indexOf(id);
  if (i < c.lessonIds.length - 1) return c.lessonIds[i + 1];
  const ci = courses.indexOf(c);
  return courses[ci + 1]?.lessonIds[0] ?? null;
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId)!;
  const course = courseForLesson(lessonId)!;
  const { state, hydrated, actions } = useStore();
  const progress = state.lessons[lessonId];
  const [step, setStep] = useState(0);
  const [resumed, setResumed] = useState(false);
  // practice answers are saved with the lesson, so they survive section changes and reloads;
  // the score uses each question's first-try outcome (retries don't change it)
  const saved = progress?.practice ?? {};
  const results: Record<number, Outcome> = Object.fromEntries(Object.entries(saved).map(([k, v]) => [k, v.first]));
  const recordResult = (i: number, o: Outcome, answer: string) => actions.recordPracticeAnswer(lessonId, i, o, answer);
  const [hindiDialogue, setHindiDialogue] = useState(true);
  const [spoken, setSpoken] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userNavigated = useRef(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const mic = useSpeechRecognition((t) => setSpoken(t));

  // resume from saved step once local progress is available
  if (hydrated && !resumed) {
    setResumed(true);
    if (progress?.step && !progress.completedAt) setStep(Math.min(progress.step, SECTIONS.length - 1));
  }

  useEffect(() => {
    // keep the active section tab visible on narrow screens
    tabRefs.current[step]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    // move focus only when the learner changed section (not on load/resume)
    if (userNavigated.current) {
      userNavigated.current = false;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  const go = (s: number) => {
    if (step === 5 && s !== 5) mic.cancel(); // stop listening when leaving the Speak step
    userNavigated.current = true;
    setStep(s);
    actions.setLessonStep(lessonId, s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const attempted = Object.keys(results).length;
  const correct = Object.values(results).filter((r) => r === "correct").length; // first try only
  const total = lesson.exercise.length;
  const isDone = !!progress?.completedAt;
  const next = nextLessonId(lessonId);
  const nextLesson = next ? getLesson(next) : null;
  const L = (x: { en: string; hi: string }) => x;
  const savedPhrase = (en: string) => state.savedPhrases.find((p) => p.en.toLowerCase() === en.toLowerCase());

  return (
    <Container className="max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/courses/${course.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-violet">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {course.title}
        </Link>
        <div className="flex items-center gap-2">
          {isDone && <Pill tone="success"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Completed</Pill>}
          <GlassButton
            size="icon"
            variant="ghost"
            aria-label={progress?.bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            pressed={!!progress?.bookmarked}
            onClick={() => actions.toggleBookmark(lessonId)}
          >
            {progress?.bookmarked ? <BookmarkCheck className="h-5 w-5 text-violet" aria-hidden /> : <Bookmark className="h-5 w-5" aria-hidden />}
          </GlassButton>
        </div>
      </div>

      <header className="mb-5">
        <p className="text-sm font-semibold text-violet">{lesson.minutes} min lesson</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{lesson.title}</h1>
        <p lang="hi" className="hi text-lg text-ink-soft">{lesson.titleHi}</p>
      </header>

      <nav aria-label="Lesson sections" className="mb-6">
        <ol className="glass no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1">
          {SECTIONS.map((s, i) => (
            <li key={s} className="shrink-0">
              <button
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                onClick={() => go(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn("press min-h-11 rounded-full px-3.5 text-sm font-semibold", i === step ? "glass-primary" : i < step ? "text-violet" : "text-ink-soft hover:text-ink")}
              >
                {i + 1}. {s}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3">
          <ProgressBar value={((step + 1) / SECTIONS.length) * 100} label="Lesson progress" />
        </div>
      </nav>

      <GlassCard padding="lg" as="section" aria-labelledby="sec-title">
        <h2 id="sec-title" ref={headingRef} tabIndex={-1} className="mb-4 flex items-center gap-2 text-xl font-bold text-ink outline-none">
          {SECTIONS[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-5">
            <GlassCard nested>
              <p className="flex items-center gap-2 text-sm font-semibold text-violet"><Target className="h-4 w-4" aria-hidden /> Learning objective</p>
              <Explain className="mt-2 text-ink" {...L(lesson.objective)} />
            </GlassCard>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet"><Lightbulb className="h-4 w-4" aria-hidden /> Explanation</p>
              <Explain className="text-ink" {...L(lesson.explanation)} />
            </div>
            <p className="text-xs text-ink-mute">Change explanation language anytime in Settings.</p>
          </div>
        )}

        {step === 1 && (
          <ul className="grid grid-cols-1 gap-3">
            {lesson.examples.map((ex) => (
              <li key={ex.en}>
                <GlassCard nested>
                  <p lang="hi" className="hi text-ink-soft">{ex.hi}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <p className="text-lg font-semibold text-ink">{ex.en}</p>
                    <div className="flex gap-1.5">
                      <SpeakButton text={ex.en} />
                      <GlassButton
                        size="icon"
                        variant="ghost"
                        aria-label={savedPhrase(ex.en) ? `Remove saved phrase: ${ex.en}` : `Save phrase: ${ex.en}`}
                        pressed={!!savedPhrase(ex.en)}
                        onClick={() => {
                          const sp = savedPhrase(ex.en);
                          if (sp) actions.removePhrase(sp.id);
                          else actions.savePhrase({ en: ex.en, hi: ex.hi, source: "lesson" });
                        }}
                      >
                        {savedPhrase(ex.en) ? <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                      </GlassButton>
                    </div>
                  </div>
                  {ex.alt && <p className="text-sm text-ink-soft">Also natural: {ex.alt}</p>}
                  {ex.note && <p className="mt-1 flex gap-1.5 text-sm text-ink-mute"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />{ex.note}</p>}
                </GlassCard>
              </li>
            ))}
          </ul>
        )}

        {(
          <div className="space-y-3" hidden={step !== 2}>
            <p className="font-semibold text-ink">{lesson.pattern.title}</p>
            <Explain className="text-sm text-ink-soft" {...L(lesson.pattern.instruction)} />
            {lesson.pattern.items.map((it, i) => (
              <PatternQuestion key={i} item={it} index={i + 1} />
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft"><MessageCircle className="mr-1 inline h-4 w-4" aria-hidden />{lesson.dialogue.context}</p>
              <button
                type="button"
                role="switch"
                aria-checked={hindiDialogue}
                onClick={() => setHindiDialogue((h) => !h)}
                className={cn("glass-inset press min-h-11 rounded-full px-4 text-sm font-semibold", hindiDialogue ? "glass-selected text-violet" : "text-ink-soft")}
              >
                Hindi help {hindiDialogue ? "on" : "off"}
              </button>
            </div>
            <ol className="space-y-3">
              {lesson.dialogue.lines.map((line, i) => {
                const speakerA = line.speaker === lesson.dialogue.lines[0].speaker;
                return (
                  <li key={i} className={cn("flex gap-2", !speakerA && "flex-row-reverse")}>
                    <div className={cn("max-w-[85%] rounded-[20px] px-4 py-3", speakerA ? "glass-inset rounded-tl-md" : "glass-inset rounded-tr-md bg-violet-soft")}>
                      <p className="text-xs font-bold text-violet">{line.speaker}</p>
                      <p className="text-ink">{line.en}</p>
                      {hindiDialogue && <p lang="hi" className="hi text-sm text-ink-soft">{line.hi}</p>}
                    </div>
                    <SpeakButton text={line.en} className="self-end" />
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {(
          <div className="space-y-3" hidden={step !== 4}>
            <p className="text-sm text-ink-soft">Several answers can be correct — we check meaning, not just exact words.</p>
            {lesson.exercise.map((ex, i) =>
              ex.kind === "mcq" ? (
                <ChoiceQuestion key={`${i}-${hydrated}`} index={i + 1} prompt={ex.prompt} promptHi={ex.promptHi} options={ex.options} answer={ex.answer} explain={ex.feedback} onResult={(o, a) => recordResult(i, o, a)} initial={saved[i]?.answer} />
              ) : (
                <TranslateQuestion key={`${i}-${hydrated}`} index={i + 1} item={ex} onResult={(o, a) => recordResult(i, o, a)} initial={saved[i]?.answer} />
              ),
            )}
            <p role="status" className="text-sm font-semibold text-ink">
              {attempted}/{total} attempted · {correct} correct on the first try
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <GlassCard nested>
              <p className="text-sm font-semibold text-violet">Speaking prompt</p>
              <Explain className="mt-1 text-lg text-ink" {...L(lesson.speaking.prompt)} />
            </GlassCard>
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              {mic.supported ? (
                <>
                  <MicButton state={mic.state} onStart={mic.start} onStop={mic.stop} />
                  <p role="status" className="text-sm text-ink-soft">
                    {mic.state === "error" && mic.error ? micErrorText[mic.error].en : mic.state === "listening" && mic.interim ? `“${mic.interim}”` : micStatusText[mic.state]}
                  </p>
                  <p className="max-w-md text-xs text-ink-mute">{SPEECH_PRIVACY_NOTE}</p>
                </>
              ) : (
                <p className="text-sm text-ink-soft">Speech input isn’t available in this browser. Say your answer aloud, then type it below.</p>
              )}
            </div>
            <GlassTextarea id="speak-text" label="What you said (edit or type)" rows={3} value={spoken} onChange={(e) => setSpoken(e.target.value)} placeholder="Your answer appears here, or type it" />
            {spoken.trim() && (
              <GlassCard nested>
                <p className="text-sm font-semibold text-ink">Compare with a sample answer</p>
                <div className="mt-1 flex items-start justify-between gap-3">
                  <p className="text-ink-soft">{lesson.speaking.sample}</p>
                  <SpeakButton text={lesson.speaking.sample} />
                </div>
                <p className="mt-2 text-xs text-ink-mute">
                  No score is shown: a transcript can’t tell us how your pronunciation sounded. Focus on whether you expressed the idea clearly — accents are not mistakes.
                </p>
              </GlassCard>
            )}
            <p className="flex gap-2 text-sm text-ink-soft"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden />{lesson.speaking.tip.en}</p>
            <p lang="hi" className="hi -mt-2 pl-6 text-sm text-ink-mute">{lesson.speaking.tip.hi}</p>
          </div>
        )}

        {step === 6 && (
          <div>
            <ul className="space-y-2">
              {lesson.recap.map((r) => (
                <li key={r} className="flex gap-2 text-ink"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />{r}</li>
              ))}
            </ul>
            <div className="mt-6" aria-live="polite">
              {isDone ? (
                <GlassCard nested className="text-center">
                  <PartyPopper className="mx-auto h-8 w-8 text-violet" aria-hidden />
                  <p className="mt-2 text-lg font-bold text-ink">Lesson complete!</p>
                  <p lang="hi" className="hi text-ink-soft">शाबाश! यह लेसन पूरा हुआ।</p>
                  {progress?.exerciseTotal ? <p className="mt-1 text-sm text-ink-soft">Practice: {progress.exerciseCorrect}/{progress.exerciseTotal} correct on the first try.</p> : null}
                  <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                    {nextLesson ? (
                      <GlassLink href={`/learn/${nextLesson.id}`} variant="primary" className="whitespace-normal py-2 text-center" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                        Next: {nextLesson.title}
                      </GlassLink>
                    ) : (
                      <GlassLink href="/progress" variant="primary">See your progress</GlassLink>
                    )}
                    <GlassLink href="/practice" icon={<Mic className="h-4 w-4" aria-hidden />}>Practise speaking</GlassLink>
                  </div>
                </GlassCard>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    disabled={attempted < total}
                    onClick={() => actions.completeLesson(lessonId, lesson.minutes, { exerciseCorrect: correct, exerciseTotal: total })}
                    icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
                  >
                    Complete lesson
                  </GlassButton>
                  {attempted < total && (
                    <p className="text-sm text-ink-soft">
                      Try all {total} practice questions first ({attempted} done).{" "}
                      <button type="button" className="min-h-11 font-semibold text-violet underline" onClick={() => go(4)}>Go to practice</button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3 border-t border-[var(--glass-edge)] pt-5">
          <GlassButton variant="ghost" disabled={step === 0} onClick={() => go(step - 1)} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
            Previous
          </GlassButton>
          {step < SECTIONS.length - 1 && (
            <GlassButton variant="primary" onClick={() => go(step + 1)}>
              Next<span className="hidden sm:inline">: {SECTIONS[step + 1]}</span> <ArrowRight className="h-4 w-4" aria-hidden />
            </GlassButton>
          )}
        </div>
      </GlassCard>
    </Container>
  );
}
