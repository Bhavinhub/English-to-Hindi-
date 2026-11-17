"use client";
import Link from "next/link";
import { Award, BookOpen, Layers, Lock, Mic, CalendarDays, Info } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { Container, PageHeader, Pill, ProgressBar, Skeleton, EmptyState } from "@/components/common/ui";
import { courses } from "@/data/courses";
import { lessons } from "@/data/lessons";
import { getTopic } from "@/data/conversations";
import { computeStreak, todayKey, useStore } from "@/lib/store";
import { getAchievements } from "@/lib/achievements";
import { timeAgo } from "@/lib/activity";
import { cn } from "@/lib/cn";

export function ProgressView() {
  const { state, hydrated } = useStore();
  if (!hydrated)
    return (
      <Container>
        <Skeleton className="h-10 w-60" />
        <Skeleton className="mt-6 h-64" />
      </Container>
    );

  const done = lessons.filter((l) => state.lessons[l.id]?.completedAt).length;
  const reviews = Object.values(state.reviews).reduce((a, r) => a + r.reviews, 0);
  const achievements = getAchievements(state);
  const streak = computeStreak(state.activity);

  // last 35 days
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const k = todayKey(d);
    const a = state.activity[k];
    const count = a ? a.lessons + a.practice + a.reviews + a.translations : 0;
    return { k, count, a, label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
  });
  const level = (c: number) => (c === 0 ? 0 : c < 3 ? 1 : c < 8 ? 2 : 3);
  const shades = ["glass-inset", "bg-[#c4b5ff]/60", "bg-[#8b6cff]/70", "bg-[#5532e0]"];

  return (
    <Container>
      <PageHeader eyebrow="Progress" title="Your learning history" hi="आपकी सीखने की यात्रा">
        Everything here is calculated from activity on this device. Time spent and activity counts show effort — they are not a measure of verified speaking proficiency.
      </PageHeader>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Lessons completed", value: `${done}/${lessons.length}` },
          { icon: Mic, label: "Practice sessions", value: state.practice.length },
          { icon: Layers, label: "Flashcards reviewed", value: reviews },
          { icon: CalendarDays, label: "Current streak", value: `${streak} ${streak === 1 ? "day" : "days"}` },
        ].map(({ icon: I, label, value }) => (
          <li key={label}>
            <GlassCard interactive className="h-full">
              <I className="h-5 w-5 text-violet" aria-hidden />
              <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
              <p className="text-sm text-ink-soft">{label}</p>
            </GlassCard>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard as="section" aria-labelledby="by-course">
          <h2 id="by-course" className="mb-4 font-bold text-ink">Lesson completion by course</h2>
          <ul className="space-y-4">
            {courses.map((c) => {
              const n = c.lessonIds.filter((id) => state.lessons[id]?.completedAt).length;
              return (
                <li key={c.slug}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Link href={`/courses/${c.slug}`} className="inline-flex min-h-11 items-center font-semibold text-ink hover:text-violet">{c.title}</Link>
                    <span className="text-ink-soft">{n}/{c.lessonIds.length}</span>
                  </div>
                  <ProgressBar value={(n / c.lessonIds.length) * 100} label={`${c.title} completion`} />
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <GlassCard as="section" aria-labelledby="activity">
          <h2 id="activity" className="mb-1 font-bold text-ink">Activity by date</h2>
          <p className="mb-4 text-xs text-ink-mute">Last 5 weeks · lessons, practice, reviews and challenges</p>
          <ol className="grid grid-cols-7 gap-1.5" aria-label="Daily activity, last 35 days">
            {days.map((d) => (
              <li
                key={d.k}
                className={cn("aspect-square rounded-lg", shades[level(d.count)], d.k === todayKey() && "ring-2 ring-[var(--violet)]")}
                title={`${d.label}: ${d.count} activities`}
                aria-label={`${d.label}: ${d.count === 0 ? "no activity" : `${d.a!.lessons} lessons, ${d.a!.practice} practice sessions, ${d.a!.reviews} reviews, ${d.a!.translations} challenges`}`}
              />
            ))}
          </ol>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute" aria-hidden>
            Less {shades.map((s) => <span key={s} className={cn("h-3 w-3 rounded", s)} />)} More
          </div>
        </GlassCard>
      </div>

      <GlassCard as="section" aria-labelledby="sessions" className="mt-6">
        <h2 id="sessions" className="mb-4 font-bold text-ink">Practice sessions</h2>
        {state.practice.length === 0 ? (
          <EmptyState icon={<Mic className="h-6 w-6" aria-hidden />} title="No practice sessions yet">Finish a conversation with Mira and it will be listed here.</EmptyState>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {state.practice.slice(0, 10).map((p) => (
              <li key={p.id} className="glass-inset flex items-center justify-between gap-2 rounded-2xl px-4 py-3">
                <span>
                  <span className="block font-semibold text-ink">{getTopic(p.topicId)?.title}</span>
                  <span className="text-xs text-ink-mute">{p.learnerTurns} replies · {p.level} · {p.mode === "demo" ? "demo (scripted)" : "connected AI"}</span>
                </span>
                <span className="text-xs text-ink-mute">{timeAgo(p.endedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <section aria-labelledby="ach" className="mt-6">
        <h2 id="ach" className="mb-4 flex items-center gap-2 text-xl font-bold text-ink"><Award className="h-5 w-5 text-violet" aria-hidden /> Achievements</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((a) => (
            <li key={a.id}>
              <GlassCard selected={a.earned} padding="sm" className={cn("h-full", !a.earned && "opacity-75")}>
                <div className="flex items-center justify-between">
                  {a.earned ? <Award className="h-6 w-6 text-violet" aria-hidden /> : <Lock className="h-5 w-5 text-ink-mute" aria-hidden />}
                  <Pill tone={a.earned ? "success" : "neutral"}>{a.earned ? "Earned" : a.progress}</Pill>
                </div>
                <p className="mt-3 font-semibold text-ink">{a.title}</p>
                <p lang="hi" className="hi text-xs text-ink-mute">{a.hi}</p>
                <p className="mt-1 text-xs text-ink-soft">{a.desc}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-6 flex gap-2 text-xs text-ink-mute"><Info className="h-4 w-4 shrink-0" aria-hidden /> Achievements unlock only when their condition is met by your own activity.</p>
    </Container>
  );
}
