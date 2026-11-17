"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, RotateCcw } from "lucide-react";
import { GlassButton, GlassCard, GlassInput } from "@/components/glass";
import type { ExerciseItem, PatternItem } from "@/data/lessons";
import { checkAnswer } from "@/lib/answers";
import { cn } from "@/lib/cn";

export type Outcome = "correct" | "close" | "incorrect";

function Feedback({ status, children }: { status: Outcome; children: React.ReactNode }) {
  const map = {
    correct: { I: CheckCircle2, cls: "bg-success-soft text-success", title: "Correct!" },
    close: { I: AlertCircle, cls: "bg-warn-soft text-warn", title: "Almost there" },
    incorrect: { I: XCircle, cls: "bg-danger-soft text-danger", title: "Not quite" },
  }[status];
  return (
    <div role="status" className={cn("mt-3 flex gap-2 rounded-2xl p-3 text-sm", map.cls)}>
      <map.I className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{map.title}</p>
        <div className="text-ink-soft">{children}</div>
      </div>
    </div>
  );
}

export function ChoiceQuestion({ prompt, promptHi, options, answer, explain, onResult, index, initial }: { prompt: string; promptHi?: string; options: string[]; answer: string; explain: string; onResult?: (o: Outcome, picked: string) => void; index: number; initial?: string }) {
  const [picked, setPicked] = useState<string | null>(initial && options.includes(initial) ? initial : null);
  const correct = picked === answer;
  return (
    <GlassCard nested>
      <fieldset>
        <legend className="font-semibold text-ink">
          <span className="text-ink-mute">{index}. </span>
          {prompt}
        </legend>
        {promptHi && <p lang="hi" className="hi text-sm text-ink-mute">{promptHi}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => {
            const isPicked = picked === o;
            return (
              <button
                key={o}
                type="button"
                aria-disabled={correct || undefined}
                aria-pressed={isPicked}
                onClick={() => {
                  if (correct) return; // solved — keep focus, ignore further clicks
                  setPicked(o);
                  onResult?.(o === answer ? "correct" : "incorrect", o);
                }}
                className={cn(
                  "glass press min-h-11 rounded-full px-4 text-left text-sm font-medium text-ink aria-disabled:cursor-default",
                  isPicked && (o === answer ? "!bg-success-soft !border-[var(--success)]" : "!bg-danger-soft !border-[var(--danger)]"),
                )}
              >
                {o}
              </button>
            );
          })}
        </div>
      </fieldset>
      {picked && (
        <Feedback status={correct ? "correct" : "incorrect"}>
          {correct ? explain : <>Try again. Hint: {explain}</>}
        </Feedback>
      )}
    </GlassCard>
  );
}

export function TranslateQuestion({ item, index, onResult, initial }: { item: Extract<ExerciseItem, { kind: "translate" }>; index: number; onResult?: (o: Outcome, answer: string) => void; initial?: string }) {
  const [value, setValue] = useState(initial ?? "");
  const [result, setResult] = useState<ReturnType<typeof checkAnswer> | null>(() => (initial ? checkAnswer(initial, item.accepted) : null));
  const [showAnswer, setShowAnswer] = useState(false);
  const id = `tr-${index}-${item.hi.length}`;
  return (
    <GlassCard nested>
      <p className="font-semibold text-ink">
        <span className="text-ink-mute">{index}. </span>Say this in English:
      </p>
      <p lang="hi" className="hi mt-1 text-xl text-ink">{item.hi}</p>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          const r = checkAnswer(value, item.accepted);
          setResult(r);
          onResult?.(r.status, value);
        }}
      >
        <GlassInput id={id} label="Your English answer" hideLabel value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type your answer" autoComplete="off" readOnly={result?.status === "correct"} />
        <GlassButton type="submit" variant="primary" disabled={!value.trim() || result?.status === "correct"}>Check</GlassButton>
      </form>
      {result && (
        <Feedback status={result.status}>
          {result.status === "correct" && (
            <>
              Natural and correct. {item.feedback}
              {item.accepted.length > 1 && <span className="mt-1 block">Other good answers: {item.accepted.filter((a) => a !== result.best).slice(0, 2).join(" · ")}</span>}
            </>
          )}
          {result.status === "close" && <>Very close! Compare with: “{result.best}”. {item.feedback}</>}
          {result.status === "incorrect" && (
            <>
              {item.feedback}{" "}
              {showAnswer ? (
                <span className="font-semibold text-ink">One natural answer: “{item.accepted[0]}”</span>
              ) : (
                <button type="button" className="min-h-11 font-semibold text-violet underline" onClick={() => { setShowAnswer(true); onResult?.("incorrect", value); }}>Show an answer</button>
              )}
            </>
          )}
        </Feedback>
      )}
      {result && result.status !== "correct" && (
        <button type="button" onClick={() => { setValue(""); setResult(null); }} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink">
          <RotateCcw className="h-4 w-4" aria-hidden /> Try again
        </button>
      )}
    </GlassCard>
  );
}

export function PatternQuestion({ item, index }: { item: PatternItem; index: number }) {
  return <ChoiceQuestion index={index} prompt={item.prompt} options={item.options} answer={item.answer} explain={item.explain} />;
}
