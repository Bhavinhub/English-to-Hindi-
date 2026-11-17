"use client";
import Link from "next/link";
import { useState } from "react";
import {
  MessagesSquare, Languages, Coffee, BriefcaseBusiness, AudioLines, LineChart, Target, BookOpen, Mic, RotateCcw,
  ArrowRight, Clock, Layers, ChevronDown, Flame, CheckCircle2, Bookmark, History, Eye, Sparkles,
} from "lucide-react";
import { GlassCard, GlassLink, GlassButton } from "@/components/glass";
import { Icon } from "@/components/common/Icon";
import { SpeakButton, Pill } from "@/components/common/ui";
import { TutorPreview } from "./TutorPreview";
import { courses, toneClass } from "@/data/courses";
import { getLesson } from "@/data/lessons";
import { topics } from "@/data/conversations";
import { phrases } from "@/data/phrases";
import { faqs, freeOffer } from "@/data/site";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { onRadioGroupKeyDown } from "@/lib/useRadioKeys";

function SectionTitle({ id, eyebrow, title, hi, sub }: { id?: string; eyebrow: string; title: string; hi?: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-violet">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {hi && <p className="hi mt-1 text-ink-soft">{hi}</p>}
      {sub && <p className="mt-3 text-ink-soft">{sub}</p>}
    </div>
  );
}

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

/* B. Hero */
export function Hero() {
  const { state } = useStore();
  return (
    <section aria-labelledby="hero-title" className={cn(wrap, "grid items-center gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14")}>
      <div>
        <Pill tone="violet" className="mb-5">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Launch offer · everything free · no sign-up
        </Pill>
        <h1 id="hero-title" className="text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Hindi se English.{" "}
          <span className="bg-gradient-to-r from-[#6a47f0] to-[#2f8fd8] bg-clip-text text-transparent dark:from-[#b9a8ff] dark:to-[#8ccbff]">
            Speak with confidence.
          </span>
        </h1>
        <p lang="hi" className="hi mt-5 text-xl text-ink">
          हिंदी की मदद से अंग्रेज़ी सीखें और रोज़ बोलने की प्रैक्टिस करें।
        </p>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Build everyday English skills with guided lessons, practical conversations, and helpful explanations in Hindi.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <GlassLink href={state.profile.onboarded ? "/dashboard" : "/onboarding"} variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" aria-hidden />}>
            Start Learning Free
          </GlassLink>
          <GlassLink href="/practice?topic=introductions" variant="secondary" size="lg" icon={<MessagesSquare className="h-5 w-5" aria-hidden />}>
            Try a Conversation
          </GlassLink>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          {["6 courses · 18 lessons", "10 conversation topics", "Works on any phone"].map((x) => (
            <li key={x} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden /> {x}
            </li>
          ))}
        </ul>
      </div>
      <TutorPreview />
    </section>
  );
}

/* C. Benefits */
const benefits = [
  { icon: MessagesSquare, title: "AI conversation practice", hi: "बातचीत की प्रैक्टिस", desc: "Practise real situations with Mira. Demo scripts work now; connected AI when configured.", href: "/practice", cta: "Start a conversation" },
  { icon: Languages, title: "Hindi explanations", hi: "हिंदी में समझ", desc: "Every lesson explains the idea in simple Hindi, so meaning is never lost.", href: "/learn/found-1", cta: "Open a lesson" },
  { icon: Coffee, title: "Everyday English", hi: "रोज़ की अंग्रेज़ी", desc: "Order food, shop, travel and ask for help with natural phrases.", href: "/courses/everyday-conversations", cta: "View course" },
  { icon: BriefcaseBusiness, title: "Interview preparation", hi: "इंटरव्यू की तैयारी", desc: "Answer “Tell me about yourself” and other common questions clearly.", href: "/courses/workplace-interview-english", cta: "Prepare now" },
  { icon: AudioLines, title: "Vocabulary & pronunciation practice", hi: "शब्द और उच्चारण", desc: "Flashcards with listening and spaced review. Hear words, then say them aloud.", href: "/vocabulary", cta: "Review words" },
  { icon: LineChart, title: "Personal learning progress", hi: "आपकी प्रगति", desc: "Streaks, completed lessons and practice history — calculated from what you actually do.", href: "/progress", cta: "See progress" },
];
export function Benefits() {
  return (
    <section aria-labelledby="benefits" className={cn(wrap, "mt-24")}>
      <SectionTitle id="benefits" eyebrow="Why Bolo English" title="Everything you need to start speaking" hi="बोलना शुरू करने के लिए सब कुछ" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ icon: I, ...b }) => (
          <li key={b.title}>
            <GlassCard interactive className="flex h-full flex-col">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-soft text-violet">
                <I className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-ink">{b.title}</h3>
              <p lang="hi" className="hi text-sm text-ink-mute">{b.hi}</p>
              <p className="mt-2 flex-1 text-ink-soft">{b.desc}</p>
              <Link href={b.href} className="mt-4 inline-flex min-h-11 items-center gap-1.5 self-start font-semibold text-violet hover:gap-2.5">
                {b.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </GlassCard>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* D. How it works */
const steps = [
  { icon: Target, title: "Choose your goal", hi: "लक्ष्य चुनें", desc: "Pick conversation, career, interviews, travel or study." },
  { icon: BookOpen, title: "Learn useful expressions", hi: "काम के वाक्य सीखें", desc: "Short lessons with Hindi help and real examples." },
  { icon: Mic, title: "Practise a conversation", hi: "बातचीत करें", desc: "Speak or type with Mira, with Hindi hints when stuck." },
  { icon: RotateCcw, title: "Review and repeat", hi: "दोहराएँ", desc: "Flashcards and challenges bring words back at the right time." },
];
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className={cn(wrap, "mt-24 scroll-mt-28")}>
      <span id="how-it-works" className="block scroll-mt-28" />
      <SectionTitle id="how-title" eyebrow="How it works" title="Four simple steps, every day" hi="हर दिन चार आसान क़दम" />
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {steps.map(({ icon: I, ...s }, i) => (
          <li key={s.title}>
            <GlassCard className="h-full">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-full glass-primary">
                  <I className="h-5 w-5" aria-hidden />
                </div>
                <span className="text-3xl font-extrabold text-violet/25" aria-hidden>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-ink">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p lang="hi" className="hi text-sm text-ink-mute">{s.hi}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.desc}</p>
            </GlassCard>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* E. Featured courses */
export function CourseCard({ slug }: { slug: string }) {
  const c = courses.find((x) => x.slug === slug)!;
  const minutes = c.lessonIds.reduce((a, id) => a + (getLesson(id)?.minutes ?? 0), 0);
  return (
    <GlassCard interactive className="flex h-full flex-col">
      <div className={cn("mb-4 flex items-center justify-between rounded-[18px] bg-gradient-to-br p-4", toneClass[c.tone])}>
        <Icon name={c.icon} className="h-8 w-8" />
        <Pill>{c.levelLabel}</Pill>
      </div>
      <h3 className="text-lg font-bold text-ink">{c.title}</h3>
      <p lang="hi" className="hi text-sm text-ink-mute">{c.titleHi}</p>
      <p className="mt-2 text-sm text-ink-soft">{c.summary}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-ink-soft">
        <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" aria-hidden /> {c.lessonIds.length} lessons</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> ~{minutes} min</span>
      </div>
      <ul className="mt-3 flex-1 space-y-1.5 text-sm text-ink-soft">
        {c.outcomes.map((o) => (
          <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {o}</li>
        ))}
      </ul>
      <GlassLink href={`/courses/${c.slug}`} className="mt-5 self-start" size="sm" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
        View Course<span className="sr-only">: {c.title}</span>
      </GlassLink>
    </GlassCard>
  );
}
export function FeaturedCourses() {
  return (
    <section aria-labelledby="featured" className={cn(wrap, "mt-24")}>
      <SectionTitle id="featured" eyebrow="Courses" title="Start with what you need most" hi="जो सबसे ज़रूरी है, वहीं से शुरू करें" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <li key={c.slug}><CourseCard slug={c.slug} /></li>
        ))}
      </ul>
    </section>
  );
}

/* F. Topics */
export function Topics() {
  return (
    <section aria-labelledby="topics" className={cn(wrap, "mt-24")}>
      <SectionTitle id="topics" eyebrow="Speaking practice" title="Practise real-life conversations" hi="असली ज़िंदगी की बातचीत" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {topics.map((t) => (
          <li key={t.id}>
            <Link href={`/practice?topic=${t.id}`} className="glass glass-hover press flex h-full min-h-28 flex-col justify-between rounded-[20px] p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-soft text-violet"><Icon name={t.icon} className="h-5 w-5" /></span>
              <span className="mt-3">
                <span className="block font-semibold text-ink">{t.title}</span>
                <span lang="hi" className="hi block text-xs text-ink-mute">{t.titleHi}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* G. Translate preview */
const previewIds = ["learn-english", "speak-slowly", "interview-prep", "didnt-understand", "glass-water"];
export function TranslatePreview() {
  const items = previewIds.map((id) => phrases.find((p) => p.id === id)!);
  const [sel, setSel] = useState(items[0].id);
  const [revealed, setRevealed] = useState(false);
  const p = items.find((x) => x.id === sel)!;
  return (
    <section aria-labelledby="try-translate" className={cn(wrap, "mt-24")}>
      <SectionTitle id="try-translate" eyebrow="Try it" title="Hindi to natural English" hi="हिंदी से स्वाभाविक अंग्रेज़ी" sub="Pick a sentence, think of the English, then reveal it." />
      <GlassCard padding="lg" className="mx-auto max-w-3xl">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Choose an example" onKeyDown={onRadioGroupKeyDown}>
          {items.map((x) => (
            <button
              key={x.id}
              role="radio"
              aria-checked={x.id === sel}
              tabIndex={x.id === sel ? 0 : -1}
              type="button"
              onClick={() => { setSel(x.id); setRevealed(false); }}
              className={cn("press hi min-h-11 shrink-0 rounded-full px-4 text-sm", x.id === sel ? "glass-inset glass-selected text-ink" : "glass-inset text-ink-soft")}
              lang="hi"
            >
              {x.hi}
            </button>
          ))}
        </div>
        <p lang="hi" className="hi mt-6 text-2xl font-semibold text-ink">{p.hi}</p>
        <div aria-live="polite">
          {revealed ? (
            <GlassCard nested className="mt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet">Natural English</p>
                  <p className="mt-1 text-xl font-semibold text-ink">{p.en}</p>
                  {p.alts[0] && <p className="mt-1 text-sm text-ink-soft">Also: {p.alts[0]}</p>}
                </div>
                <SpeakButton text={p.en} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">{p.explanation}</p>
              <p lang="hi" className="hi text-sm text-ink-mute">{p.explanationHi}</p>
            </GlassCard>
          ) : (
            <GlassButton variant="primary" className="mt-5" icon={<Eye className="h-4 w-4" aria-hidden />} onClick={() => setRevealed(true)}>
              Reveal translation
            </GlassButton>
          )}
        </div>
        <Link href="/translate" className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-semibold text-violet">
          Practise all {phrases.length} sentences <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </GlassCard>
    </section>
  );
}

/* H. Dashboard preview */
export function DashboardPreview() {
  const items = [
    { icon: Flame, label: "Streak", value: "4 days", note: "Days in a row with any learning activity." },
    { icon: CheckCircle2, label: "Lessons", value: "7 / 18", note: "Marked complete when you finish a lesson’s practice." },
    { icon: Bookmark, label: "Saved words", value: "23", note: "Words and phrases you chose to keep for review." },
    { icon: History, label: "Practice sessions", value: "5", note: "Conversations you finished with Mira." },
  ];
  return (
    <section aria-labelledby="dash-preview" className={cn(wrap, "mt-24")}>
      <SectionTitle id="dash-preview" eyebrow="Your learning space" title="See your progress clearly" hi="अपनी प्रगति साफ़ देखें" />
      <GlassCard padding="lg" className="relative">
        <Pill tone="warn" className="absolute right-5 top-5">Example data</Pill>
        <p className="mb-5 max-w-xl pr-24 text-sm text-ink-soft">
          This is an illustration. Your real dashboard starts at zero and only counts what you actually do on this device.
        </p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: I, ...x }) => (
            <li key={x.label}>
              <GlassCard nested className="h-full">
                <I className="h-5 w-5 text-violet" aria-hidden />
                <p className="mt-3 text-2xl font-bold text-ink">{x.value}</p>
                <p className="text-sm font-semibold text-ink">{x.label}</p>
                <p className="mt-1 text-xs text-ink-soft">{x.note}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </GlassCard>
    </section>
  );
}

/* I. Plans, FAQ, CTA */
export function PlansPreview() {
  const { state } = useStore();
  return (
    <section aria-labelledby="plans" className={cn(wrap, "mt-24")}>
      <SectionTitle id="plans" eyebrow={freeOffer.badge} title="Every feature is free for everyone" hi="सब कुछ मुफ़्त — कोई प्लान नहीं, कोई कार्ड नहीं" sub={freeOffer.tagline} />
      <GlassCard padding="lg" selected className="mx-auto max-w-4xl">
        <p className="text-center">
          <span className="text-4xl font-extrabold text-ink">{freeOffer.price}</span> <span className="text-ink-mute">{freeOffer.period}</span>
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {freeOffer.features.map((f) => (
            <li key={f.label} className="flex gap-2 text-ink-soft">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              <span>
                {f.label}
                {f.note && <span className="block text-xs text-ink-mute">{f.note}</span>}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <GlassLink href={state.profile.onboarded ? "/dashboard" : "/onboarding"} variant="primary">{freeOffer.cta}</GlassLink>
          <GlassLink href="/pricing">See what’s included</GlassLink>
        </div>
      </GlassCard>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq-title" className={cn(wrap, "mt-24")}>
      <span id="faq" className="block scroll-mt-28" />
      <SectionTitle id="faq-title" eyebrow="FAQ" title="Questions, answered honestly" hi="आपके सवाल" />
      <ul className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q}>
              <GlassCard padding="none">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-left font-semibold text-ink"
                  >
                    {f.q}
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden />
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen} className="px-5 pb-5 text-ink-soft">
                  {f.a}
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FinalCTA() {
  const { state } = useStore();
  const resuming = !!state.lastLessonId;
  const href = resuming ? `/learn/${state.lastLessonId}` : state.profile.onboarded ? "/dashboard" : "/onboarding";
  return (
    <section aria-labelledby="final-cta" className={cn(wrap, "mt-24")}>
      <GlassCard padding="lg" className="overflow-hidden text-center">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[var(--ambient-1)] blur-3xl" aria-hidden />
        <h2 id="final-cta" className="text-3xl font-bold text-ink sm:text-4xl">{resuming ? "Pick up where you left off." : "Your first lesson takes about 8 minutes."}</h2>
        <p lang="hi" className="hi mt-2 text-lg text-ink-soft">आज ही पहला क़दम उठाइए।</p>
        <GlassLink href={href} variant="primary" size="lg" className="mt-6" icon={<ArrowRight className="h-5 w-5" aria-hidden />}>
          {resuming ? "Continue Your Lesson" : "Start Your First Lesson"}
        </GlassLink>
      </GlassCard>
    </section>
  );
}
