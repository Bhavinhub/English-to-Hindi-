"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Circle, Clock, PlayCircle, Target } from "lucide-react";
import { GlassCard, GlassLink } from "@/components/glass";
import { Container, Pill, ProgressBar } from "@/components/common/ui";
import { Icon } from "@/components/common/Icon";
import { getCourse, toneClass } from "@/data/courses";
import { getLesson } from "@/data/lessons";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function CourseDetail({ slug }: { slug: string }) {
  const c = getCourse(slug)!;
  const { state, hydrated } = useStore();
  const lessons = c.lessonIds.map((id) => getLesson(id)!);
  const done = lessons.filter((l) => state.lessons[l.id]?.completedAt).length;
  const next = lessons.find((l) => !state.lessons[l.id]?.completedAt) ?? lessons[0];
  const started = lessons.some((l) => state.lessons[l.id]);
  const minutes = lessons.reduce((a, l) => a + l.minutes, 0);

  return (
    <Container>
      <Link href="/courses" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-violet">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All courses
      </Link>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard padding="lg">
          <div className={cn("mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br", toneClass[c.tone])}>
            <Icon name={c.icon} className="h-7 w-7" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="violet">{c.levelLabel}</Pill>
            <Pill><Clock className="h-3 w-3" aria-hidden /> ~{minutes} min</Pill>
            <Pill>{lessons.length} lessons</Pill>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{c.title}</h1>
          <p lang="hi" className="hi text-lg text-ink-soft">{c.titleHi}</p>
          <p className="mt-3 text-ink-soft">{c.summary}</p>
          <p lang="hi" className="hi text-ink-mute">{c.summaryHi}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlassLink href={`/learn/${next.id}`} variant="primary" size="lg" icon={<PlayCircle className="h-5 w-5" aria-hidden />}>
              {done === lessons.length ? "Review course" : started ? "Continue course" : "Start course"}
            </GlassLink>
          </div>
        </GlassCard>
        <GlassCard padding="lg">
          <h2 className="flex items-center gap-2 font-bold text-ink"><Target className="h-5 w-5 text-violet" aria-hidden /> You’ll be able to</h2>
          <ul className="mt-3 space-y-2">
            {c.outcomes.map((o) => (
              <li key={o} className="flex gap-2 text-ink-soft"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {o}</li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-ink">{hydrated ? `${done} of ${lessons.length} lessons complete` : "Loading progress…"}</p>
            <ProgressBar value={(done / lessons.length) * 100} label={`${c.title} progress`} />
          </div>
        </GlassCard>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold text-ink">Curriculum</h2>
      <ol className="grid grid-cols-1 gap-3">
        {lessons.map((l, i) => {
          const p = state.lessons[l.id];
          const isDone = !!p?.completedAt;
          return (
            <li key={l.id}>
              <Link href={`/learn/${l.id}`} className="glass glass-hover press flex items-center gap-4 rounded-[20px] p-4 sm:p-5">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full", isDone ? "bg-success-soft text-success" : "glass-inset text-ink-soft")}>
                  {isDone ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Circle className="h-5 w-5" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-ink-mute">Lesson {i + 1} · {l.minutes} min</span>
                  <span className="block font-semibold text-ink">{l.title}</span>
                  <span lang="hi" className="hi block text-sm text-ink-mute">{l.titleHi}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{l.objective.en}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {p?.bookmarked && <Bookmark className="h-4 w-4 fill-current text-violet" aria-label="Bookmarked" />}
                  <span className="sr-only">{isDone ? "Completed" : p ? "In progress" : "Not started"}</span>
                  <ArrowRight className="h-5 w-5 text-ink-mute" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
