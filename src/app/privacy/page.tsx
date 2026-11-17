import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section, Bullets, linkCls, SITE_NAME, REPO_URL } from "@/components/common/InfoPage";

export const metadata: Metadata = { title: "Privacy policy", description: "How Bolo English handles your data." };

export default function Page() {
  return (
    <InfoPage title="Privacy policy" hi="गोपनीयता नीति" intro={<>{SITE_NAME} is designed to work without an account. This page explains, in plain language, what data is used and where it goes.</>}>
      <Section title="Summary">
        <Bullets
          items={[
            "No account, name, email or phone number is needed.",
            "Your learning progress is stored in your own browser by default.",
            "Cloud backup is optional and off until you turn it on in Settings.",
            "We never record or store your voice.",
            "No advertising, tracking cookies or third-party analytics.",
          ]}
        />
      </Section>
      <Section title="Data stored on your device">
        <p>
          Lessons you complete, practice history, saved words and phrases, flashcard review schedules, your learning goals and display preferences are saved in your browser’s local storage under the key <code>bolo-english:v1</code>. This data stays on your device. You can export or delete it anytime in <Link className={linkCls} href="/settings">Settings</Link>.
        </p>
      </Section>
      <Section title="Optional cloud backup">
        <p>
          If you switch on <strong>Cloud backup</strong> in Settings, a copy of the same progress data is stored in our database (Cloudflare D1) so you can restore it on another device. It is linked only to a random backup code generated in your browser — not to your name or email. Anyone with your backup code can restore that progress, so keep it private.
        </p>
        <p>
          When you turn cloud backup off, or press “Delete cloud copy”, the stored copy is deleted from the database. Backups that are not used for 12 months may be removed.
        </p>
      </Section>
      <Section title="Microphone and speech">
        <Bullets
          items={[
            "The microphone is used only after you tap the microphone button, and stops when you stop, end a session or leave the page.",
            "Speech-to-text is performed by your browser’s built-in speech service. Some browsers (for example Google Chrome) send the audio to the browser maker’s servers to convert it to text, under their own privacy policy.",
            `${SITE_NAME} receives only the resulting text, keeps it in the page while you practise, and does not store audio.`,
            "Listening audio comes from pre-recorded files on our site; no audio is sent anywhere when you press Listen.",
          ]}
        />
      </Section>
      <Section title="Connected AI (only if enabled by the site owner)">
        <p>
          If the site owner connects an AI service, messages you type in “Connected AI” mode, or sentences you ask it to translate, are sent through our server to that AI provider to generate a reply. This mode is clearly labelled and never used in Demo mode. Don’t include personal information in practice messages.
        </p>
      </Section>
      <Section title="Hosting and logs">
        <p>
          The site is hosted on Cloudflare. Like most hosting providers, Cloudflare may process basic technical information (such as IP address and browser type) to deliver the site and protect it from abuse. We do not use this information to identify you.
        </p>
      </Section>
      <Section title="Children">
        <p>{SITE_NAME} is suitable for learners of all ages and does not knowingly collect personal information from anyone. Parents or guardians can clear all data from Settings.</p>
      </Section>
      <Section title="Your choices and contact">
        <Bullets
          items={[
            <>Export or delete your data in <Link className={linkCls} href="/settings">Settings</Link>.</>,
            "Turn cloud backup off at any time; this deletes the cloud copy.",
            <>
              Questions or requests: open an issue on our{" "}
              <a className={linkCls} href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
                GitHub page
              </a>
              . Please don’t post personal details there.
            </>,
          ]}
        />
      </Section>
    </InfoPage>
  );
}
