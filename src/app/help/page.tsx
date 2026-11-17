import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section, Bullets, linkCls, REPO_URL } from "@/components/common/InfoPage";
import { faqs } from "@/data/site";

export const metadata: Metadata = { title: "Help centre" };

export default function Page() {
  return (
    <InfoPage title="Help centre" hi="सहायता केंद्र" updated={false} intro="Quick answers for getting started, using the microphone, and keeping your progress safe.">
      <Section title="Getting started">
        <Bullets
          items={[
            <>Go to <Link className={linkCls} href="/onboarding">Get started</Link> and choose your level, goal and daily time. The 5-question placement activity is optional.</>,
            "Open the suggested course and start Lesson 1. Each lesson has 7 short sections: Goal, Examples, Pattern, Dialogue, Practice, Speak and Recap.",
            "Finish all practice questions, then press “Complete lesson” on the Recap section.",
            <>Practise speaking anytime on <Link className={linkCls} href="/practice">Speaking practice</Link>, and review words on <Link className={linkCls} href="/vocabulary">Vocabulary</Link>.</>,
          ]}
        />
      </Section>
      <Section title="Microphone and listening">
        <Bullets
          items={[
            "Tap the microphone button, allow microphone access when the browser asks, then speak. Tap again to stop.",
            "If you blocked the microphone earlier, click the lock / site-settings icon in the address bar and allow the microphone, then reload.",
            "Speech input works in Chrome, Edge and Safari. In other browsers, type your answers — everything works by typing.",
            "Press any speaker button to hear natural-voice audio. Change the speed in Settings or on the practice page.",
            "No sound? Check your device volume, silent mode, and that another tab isn’t playing audio.",
          ]}
        />
      </Section>
      <Section title="Progress and backups">
        <Bullets
          items={[
            "Progress saves automatically in this browser. Private/incognito windows forget it when closed.",
            <>To use another device, turn on <strong>Cloud backup</strong> in <Link className={linkCls} href="/settings">Settings</Link>, copy your backup code, and enter it on the other device.</>,
            "Clearing your browser’s site data removes local progress. Export your data from Settings first if you want a copy.",
          ]}
        />
      </Section>
      <Section title="Answers marked wrong?">
        <p>
          We accept many correct versions of each answer and ignore capital letters, punctuation, short forms (I’m / I am) and words like “please”. If you think a correct answer was rejected, let us know so we can add it.
        </p>
      </Section>
      <Section title="Frequently asked questions">
        <dl className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="glass-inset rounded-2xl p-4">
              <dt className="font-semibold text-ink">{f.q}</dt>
              <dd className="mt-1">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title="Still need help?">
        <p>
          Report a problem or suggest an improvement on our{" "}
          <a className={linkCls} href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
            GitHub issues page
          </a>
          . Include your browser and device, and what you clicked. Please don’t share personal information.
        </p>
      </Section>
    </InfoPage>
  );
}
