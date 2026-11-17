"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Languages, Layers, Mic, Target, CheckCircle2, History, Sparkles } from "lucide-react";
import { GlassCard, GlassLink } from "@/components/glass";
import { Container, EmptyState, Pill, ProgressBar, Skeleton } from "@/components/common/ui";
import { Icon } from "@/components/common/Icon";
import { courses, getCourse } from "@/data/courses";
import { getLesson, lessons } from "@/data/lessons";
import { topics } from "@/data/conversations";
import { words } from "@/data/vocabulary";
import { computeStreak, todayKey, useStore, useToday } from "@/lib/store";
import { recentEvents, timeAgo } from "@/lib/activity";
import { t } from "@/lib/copy";

function Tile({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  const { state } = useStore();
  const L = state.prefs.uiLang;
  return (
    <GlassCard interactive as="section" aria-label={title} className={className}>
      <h2 lang={L} className={`mb-3 flex items-center gap-2 text-sm font-semibold text-ink-soft ${L === "hi" ? "hi" : ""}`}>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-soft text-violet">{icon}</span>
        {title}
      </h2>
      {children}
    </GlassCard>
  );
}

export function Dashboard() {
  const { state, hydrated } = useStore();
  const L = state.prefs.uiLang;
  const today = useToday();

  if (!hydrated) {
    return (
      <Container>
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-44" />)}</div>
      </Container>
    );
  }

  const done = lessons.filter((l) => state.lessons[l.id]?.completedAt).length;
  const streak = computeStreak(state.activity);
  const goalPct = Math.min(100, (today.minutes / state.profile.dailyMinutes) * 100);
  const nowMs = new Date(todayKey() + "T23:59:59").getTime();
  const due = words.filter((w) => !state.reviews[w.id] || new Date(state.reviews[w.id].due).getTime() <= nowMs).length;
  const dayIndex = Math.floor(new Date(todayKey()).getTime() / 86400000);
  const topicOfDay = topics[dayIndex % topics.length];
  const practisedToday = today.practice > 0;

  // continue: last lesson if unfinished, else next unfinished in its course, else recommended course
  const last = state.lastLessonId ? getLesson(state.lastLessonId) : null;
  let cont = last && !state.lessons[last.id]?.completedAt ? last : null;
  if (!cont) {
    const course = getCourse(state.profile.recommendedCourse ?? "") ?? courses[0];
    const ordered = [...course.lessonIds, ...courses.flatMap((c) => c.lessonIds)];
    const id = ordered.find((x) => !state.lessons[x]?.completedAt);
    cont = id ? getLesson(id)! : null;
  }
  const events = recentEvents(state);

  return (
    <Container>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p lang={L} className="text-sm font-semibold uppercase tracking-wider text-violet">{t("dashboard", L)}</p>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">Namaste! Ready to practise?</h1>
          <p lang="hi" className="hi text-ink-soft">आज थोड़ा-सा अभ्यास भी काफ़ी है।</p>
        </div>
        {!state.profile.onboarded && (
          <GlassLink href="/onboarding" variant="primary" icon={<Sparkles className="h-4 w-4" aria-hidden />}>Personalise my plan</GlassLink>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Tile title={t("continueLearning", L)} icon={<BookOpen className="h-5 w-5" aria-hidden />} className="md:col-span-2 lg:col-span-2">
          {cont ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-mute">{courses.find((c) => c.lessonIds.includes(cont!.id))?.title}</p>
                <p className="text-xl font-bold text-ink">{cont.title}</p>
                <p lang="hi" className="hi text-sm text-ink-mute">{cont.titleHi}</p>
                {state.lessons[cont.id]?.step ? <Pill tone="violet" className="mt-2">In progress · section {state.lessons[cont.id].step + 1} of 7</Pill> : <Pill className="mt-2">{cont.minutes} min</Pill>}
              </div>
              <GlassLink href={`/learn/${cont.id}`} variant="primary" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                {state.lessons[cont.id]?.step ? "Resume" : "Start lesson"}
              </GlassLink>
            </div>
          ) : (
            <p className="text-ink-soft">You’ve completed every lesson. Brilliant! Keep reviewing words and practising conversations.</p>
          )}
        </Tile>

        <Tile title={t("todaysGoal", L)} icon={<Target className="h-5 w-5" aria-hidden />}>
          <p className="text-3xl font-bold text-ink">{Math.round(today.minutes)}<span className="text-base font-medium text-ink-mute"> / {state.profile.dailyMinutes} min</span></p>
          <div className="mt-3"><ProgressBar value={goalPct} label="Today’s goal progress" /></div>
          <p className="mt-2 text-xs text-ink-mute">{goalPct >= 100 ? "Goal reached — great job!" : "Estimated from lessons, practice and reviews you finish today."}</p>
        </Tile>

        <Tile title={t("dailySpeaking", L)} icon={<Mic className="h-5 w-5" aria-hidden />}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl glass-inset text-violet"><Icon name={topicOfDay.icon} className="h-5 w-5" /></span>
            <div>
              <p className="font-semibold text-ink">{topicOfDay.title}</p>
              <p className="text-xs text-ink-mute">Today’s suggested topic</p>
            </div>
          </div>
          {practisedToday && <Pill tone="success" className="mt-3"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Practised today</Pill>}
          <GlassLink href={`/practice?topic=${topicOfDay.id}`} size="sm" className="mt-4">Start speaking</GlassLink>
        </Tile>

        <Tile title={t("challenge", L)} icon={<Languages className="h-5 w-5" aria-hidden />}>
          <p className="text-3xl font-bold text-ink">{state.translations.correct}<span className="text-base font-medium text-ink-mute"> correct</span></p>
          <p className="text-sm text-ink-soft">{state.translations.attempts ? `${state.translations.attempts} ${state.translations.attempts === 1 ? "attempt" : "attempts"} so far` : "No attempts yet — try your first one."}</p>
          <GlassLink href="/translate" size="sm" className="mt-4">Take the challenge</GlassLink>
        </Tile>

        <Tile title={t("vocabReview", L)} icon={<Layers className="h-5 w-5" aria-hidden />}>
          <p className="text-3xl font-bold text-ink">{due}<span className="text-base font-medium text-ink-mute"> cards due</span></p>
          <p className="text-sm text-ink-soft">{state.savedWords.length} saved {state.savedWords.length === 1 ? "word" : "words"} · {state.savedPhrases.length} saved {state.savedPhrases.length === 1 ? "phrase" : "phrases"}</p>
          <GlassLink href="/vocabulary" size="sm" className="mt-4">Review now</GlassLink>
        </Tile>

        <Tile title={t("streak", L)} icon={<Flame className="h-5 w-5" aria-hidden />}>
          <p className="text-3xl font-bold text-ink">{streak}<span className="text-base font-medium text-ink-mute"> {streak === 1 ? "day" : "days"}</span></p>
          <p className="text-sm text-ink-soft">{streak === 0 ? "Complete any activity today to start a streak." : "Days in a row with learning activity."}</p>
        </Tile>

        <Tile title={t("completed", L)} icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}>
          <p className="text-3xl font-bold text-ink">{done}<span className="text-base font-medium text-ink-mute"> / {lessons.length}</span></p>
          <div className="mt-3"><ProgressBar value={(done / lessons.length) * 100} label="Lessons completed" /></div>
          <Link href="/progress" className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-violet">View progress <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </Tile>

        <Tile title={t("recent", L)} icon={<History className="h-5 w-5" aria-hidden />} className="md:col-span-2 lg:col-span-2">
          {events.length === 0 ? (
            <EmptyState icon={<History className="h-6 w-6" aria-hidden />} title="No activity yet" action={cont && <GlassLink href={`/learn/${cont.id}`} size="sm" variant="primary">Start your first lesson</GlassLink>}>
              Finished lessons and practice sessions will appear here.
            </EmptyState>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.at + e.title}>
                  <Link href={e.href} className="glass-inset flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-2 hover:border-[var(--violet)]">
                    <span className="flex items-center gap-2 text-sm text-ink">
                      {e.kind === "lesson" ? <BookOpen className="h-4 w-4 text-violet" aria-hidden /> : <Mic className="h-4 w-4 text-violet" aria-hidden />}
                      {e.title}
                    </span>
                    <span className="shrink-0 text-xs text-ink-mute">{timeAgo(e.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tile>
      </div>
    </Container>
  );
}
