"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, Sparkles } from "lucide-react";
import { GlassCard, GlassButton, GlassLink } from "@/components/glass";
import { Icon } from "@/components/common/Icon";
import { Container, ProgressBar } from "@/components/common/ui";
import { CourseCard } from "@/components/landing/Sections";
import { goalOptions, levelOptions, placementQuestions, recommendCourse } from "@/data/site";
import { getCourse } from "@/data/courses";
import { useStore } from "@/lib/store";
import type { ExplainLang, Goal, Level } from "@/lib/types";
import { cn } from "@/lib/cn";
import { onRadioGroupKeyDown } from "@/lib/useRadioKeys";
import { Skeleton } from "@/components/common/ui";

const STEPS = ["Level", "Goal", "Daily target", "Explanations", "Placement", "Your plan"];

function Choice({ selected, onClick, children, className }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn("glass glass-hover press flex min-h-16 w-full items-center gap-3 rounded-[20px] p-4 text-left", selected && "glass-selected", className)}
    >
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2", selected ? "border-violet bg-violet text-white" : "border-[var(--ink-mute)]")} aria-hidden>
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function Onboarding() {
  const { hydrated } = useStore();
  // wait for saved answers to load, so revisiting never overwrites them with defaults
  if (!hydrated)
    return (
      <Container className="max-w-3xl">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-6 h-96 w-full" />
      </Container>
    );
  return <OnboardingFlow />;
}

function OnboardingFlow() {
  const { state, actions } = useStore();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(state.profile.level);
  const [goal, setGoal] = useState<Goal | null>(state.profile.goal);
  const [minutes, setMinutes] = useState<5 | 10 | 20>(state.profile.dailyMinutes);
  const [explain, setExplain] = useState<ExplainLang>(state.profile.explain);
  const [quiz, setQuiz] = useState<"ask" | "taking" | "done" | "skipped">("ask");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [rec, setRec] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    // after each step change, move focus to the new question for keyboard and screen-reader users
    if (!moved.current) return;
    moved.current = false;
    cardRef.current?.querySelector<HTMLElement>("legend, h2")?.focus();
  }, [step, qi, quiz]);
  const goStep = (n: number) => {
    moved.current = true;
    setStep(n);
  };

  const score = answers.filter((a, i) => a === placementQuestions[i].answer).length;
  const canNext = [level, goal, minutes, explain, quiz === "done" || quiz === "skipped"][step];

  function finish(withScore: number | null) {
    const course = recommendCourse(level, goal, withScore);
    setRec(course);
    actions.updateProfile({
      onboarded: true,
      level,
      goal,
      dailyMinutes: minutes,
      explain,
      recommendedCourse: course,
      placement: withScore === null ? state.profile.placement : { score: withScore, total: placementQuestions.length, takenAt: new Date().toISOString() },
    });
    goStep(5);
  }

  const course = rec ? getCourse(rec) : null;

  return (
    <Container className="max-w-3xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-ink sm:text-3xl">Set up your learning plan</h1>
        <p className="text-sm font-semibold text-violet">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <div className="mt-2">
          <ProgressBar value={((step + 1) / STEPS.length) * 100} label="Onboarding progress" />
        </div>
      </div>

      <GlassCard padding="lg" ref={cardRef}>
        {step === 0 && (
          <fieldset>
            <legend tabIndex={-1} className="text-2xl font-bold text-ink outline-none">What’s your English level right now?</legend>
            <p lang="hi" className="hi mt-1 text-ink-soft">अभी आपकी अंग्रेज़ी किस स्तर पर है?</p>
            <div role="radiogroup" onKeyDown={onRadioGroupKeyDown} className="mt-6 grid grid-cols-1 gap-3">
              {levelOptions.map((l) => (
                <Choice key={l.id} selected={level === l.id} onClick={() => setLevel(l.id)}>
                  <span className="block font-semibold text-ink">{l.label} <span lang="hi" className="hi font-normal text-ink-mute">· {l.hi}</span></span>
                  <span className="block text-sm text-ink-soft">{l.desc}</span>
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend tabIndex={-1} className="text-2xl font-bold text-ink outline-none">What’s your main goal?</legend>
            <p lang="hi" className="hi mt-1 text-ink-soft">आप अंग्रेज़ी किसलिए सीखना चाहते हैं?</p>
            <div role="radiogroup" onKeyDown={onRadioGroupKeyDown} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {goalOptions.map((g) => (
                <Choice key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)}>
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    <Icon name={g.icon} className="h-5 w-5 text-violet" /> {g.label}
                  </span>
                  <span lang="hi" className="hi block text-sm text-ink-mute">{g.hi}</span>
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend tabIndex={-1} className="text-2xl font-bold text-ink outline-none">How much time can you give each day?</legend>
            <p lang="hi" className="hi mt-1 text-ink-soft">रोज़ कितना समय दे सकते हैं?</p>
            <div role="radiogroup" onKeyDown={onRadioGroupKeyDown} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([5, 10, 20] as const).map((m) => (
                <Choice key={m} selected={minutes === m} onClick={() => setMinutes(m)}>
                  <span className="block text-xl font-bold text-ink">{m} min</span>
                  <span className="block text-sm text-ink-soft">{m === 5 ? "Light" : m === 10 ? "Regular" : "Focused"}</span>
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend tabIndex={-1} className="text-2xl font-bold text-ink outline-none">How should we explain things?</legend>
            <p lang="hi" className="hi mt-1 text-ink-soft">समझाने के लिए कौन-सी भाषा?</p>
            <div role="radiogroup" onKeyDown={onRadioGroupKeyDown} className="mt-6 grid grid-cols-1 gap-3">
              {([
                ["both", "Both Hindi and English", "हिंदी और अंग्रेज़ी दोनों (recommended)"],
                ["hi", "Hindi explanations", "हिंदी में समझाइए"],
                ["en", "English explanations", "Only English"],
              ] as const).map(([id, label, sub]) => (
                <Choice key={id} selected={explain === id} onClick={() => setExplain(id)}>
                  <span className="block font-semibold text-ink">{label}</span>
                  <span className="hi block text-sm text-ink-mute">{sub}</span>
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div>
            <h2 tabIndex={-1} className="text-2xl font-bold text-ink outline-none">Optional: quick placement activity</h2>
            <p className="mt-1 text-ink-soft">Five short questions help us suggest where to begin. It’s a suggested starting point, not a certified proficiency test.</p>
            {quiz === "ask" && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <GlassButton variant="primary" onClick={() => setQuiz("taking")} icon={<Sparkles className="h-4 w-4" aria-hidden />}>Take the 5 questions</GlassButton>
                <GlassButton onClick={() => { setQuiz("skipped"); finish(null); }}>Skip and use my answers</GlassButton>
              </div>
            )}
            {quiz === "taking" && (
              <fieldset className="mt-6" key={qi}>
                <legend tabIndex={-1} className="font-semibold text-ink outline-none">
                  Question {qi + 1} of {placementQuestions.length}: {placementQuestions[qi].q}
                </legend>
                {placementQuestions[qi].hi && <p lang="hi" className="hi text-sm text-ink-mute">{placementQuestions[qi].hi}</p>}
                <div role="radiogroup" onKeyDown={onRadioGroupKeyDown} className="mt-4 grid grid-cols-1 gap-2">
                  {placementQuestions[qi].options.map((o) => (
                    <Choice key={o} selected={answers[qi] === o} onClick={() => setAnswers((a) => { const n = [...a]; n[qi] = o; return n; })}>
                      <span className="text-ink">{o}</span>
                    </Choice>
                  ))}
                </div>
                <div className="mt-5 flex justify-between gap-3">
                  <GlassButton
                    variant="ghost"
                    onClick={() => {
                      moved.current = true;
                      if (qi > 0) setQi(qi - 1);
                      else setQuiz("ask");
                    }}
                    icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
                  >
                    {qi > 0 ? "Previous question" : "Back"}
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    disabled={!answers[qi]}
                    onClick={() => {
                      moved.current = true;
                      if (qi < placementQuestions.length - 1) setQi(qi + 1);
                      else {
                        setQuiz("done");
                        finish(answers.filter((a, i) => a === placementQuestions[i].answer).length);
                      }
                    }}
                  >
                    {qi < placementQuestions.length - 1 ? "Next question" : "See my suggestion"}
                  </GlassButton>
                </div>
              </fieldset>
            )}
          </div>
        )}

        {step === 5 && course && (
          <div>
            <h2 tabIndex={-1} className="text-2xl font-bold text-ink outline-none">Your suggested starting point</h2>
            <p lang="hi" className="hi mt-1 text-ink-soft">आपके लिए सुझाया गया कोर्स</p>
            {state.profile.placement && quiz === "done" && (
              <p className="mt-3 text-ink-soft">
                You answered {score} of {placementQuestions.length} placement questions as expected.
              </p>
            )}
            <p className="mt-2 flex items-start gap-2 text-sm text-ink-mute">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> This is a suggestion based on your answers — not a certified assessment. You can start any course.
            </p>
            <div className="mt-6 max-w-md">
              <CourseCard slug={course.slug} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <GlassLink href={`/learn/${course.lessonIds[0]}`} variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" aria-hidden />}>
                Start first lesson
              </GlassLink>
              <GlassLink href="/dashboard" size="lg">Go to my dashboard</GlassLink>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="mt-8 flex justify-between gap-3">
            <GlassButton variant="ghost" disabled={step === 0} onClick={() => goStep(step - 1)} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              Back
            </GlassButton>
            <GlassButton variant="primary" disabled={!canNext} onClick={() => goStep(step + 1)}>
              Continue <ArrowRight className="h-4 w-4" aria-hidden />
            </GlassButton>
          </div>
        )}
        {step === 4 && quiz === "ask" && (
          <div className="mt-8">
            <GlassButton variant="ghost" onClick={() => goStep(3)} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>Back</GlassButton>
          </div>
        )}
        {step === 5 && (
          <button type="button" className="mt-6 min-h-11 text-sm font-semibold text-violet underline-offset-4 hover:underline" onClick={() => { goStep(0); setQuiz("ask"); setQi(0); setAnswers([]); }}>
            Change my answers
          </button>
        )}
      </GlassCard>
    </Container>
  );
}
