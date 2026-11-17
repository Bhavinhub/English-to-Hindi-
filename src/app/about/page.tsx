import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section, Bullets, linkCls, SITE_NAME } from "@/components/common/InfoPage";
import { courses } from "@/data/courses";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <InfoPage title={`About ${SITE_NAME}`} hi="हमारे बारे में" updated={false} intro={<>{SITE_NAME} helps Hindi speakers understand English and practise speaking it every day — with explanations in Hindi, practical conversations and honest feedback.</>}>
      <Section title="Who it’s for">
        <Bullets items={["Students preparing for college and exams", "Job seekers getting ready for interviews", "Working professionals who want to speak confidently at work", "Beginners who want to start from the basics, in Hindi"]} />
      </Section>
      <Section title="How we teach">
        <Bullets
          items={[
            "Meaning and context first — not just word-for-word translation.",
            "Many correct answers are accepted, because real English has many ways to say things.",
            "Accents are never treated as mistakes; clarity is what matters.",
            "Short daily practice: 5, 10 or 20 minutes is enough to build a habit.",
          ]}
        />
      </Section>
      <Section title="What’s inside">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <li key={c.slug}>
              <Link href={`/courses/${c.slug}`} className="glass-inset flex min-h-11 flex-col rounded-2xl p-4 hover:border-[var(--violet)]">
                <span className="font-semibold text-ink">{c.title}</span>
                <span lang="hi" className="hi text-sm text-ink-mute">{c.titleHi}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Our promises">
        <Bullets
          items={[
            "Everything is free during our launch offer — no card or account needed.",
            "No fake reviews, user counts or guaranteed-fluency claims.",
            "Scripted demo conversations are always labelled as scripted.",
            "No pronunciation scores unless a real assessment service provides them.",
            <>Your data stays on your device unless you choose cloud backup — see the <Link className={linkCls} href="/privacy">Privacy policy</Link>.</>,
          ]}
        />
      </Section>
    </InfoPage>
  );
}
