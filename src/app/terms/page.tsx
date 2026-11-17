import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section, Bullets, linkCls, SITE_NAME } from "@/components/common/InfoPage";

export const metadata: Metadata = { title: "Terms of use" };

export default function Page() {
  return (
    <InfoPage title="Terms of use" hi="उपयोग की शर्तें" intro={<>By using {SITE_NAME} you agree to these simple terms. If you don’t agree, please don’t use the site.</>}>
      <Section title="Using the service">
        <Bullets
          items={[
            `${SITE_NAME} is a free learning tool for practising English with help from Hindi.`,
            "Use it for personal learning. Don’t misuse it, attack it, or try to disrupt it for other people.",
            "Don’t enter personal, sensitive or confidential information into practice or translation boxes.",
          ]}
        />
      </Section>
      <Section title="Learning results">
        <p>
          Lessons, the placement activity and practice feedback are learning aids. The placement result is a suggested starting point, not a certified proficiency assessment. Demo conversations are scripted, and any coaching shown there is sample coaching, not an evaluation of your speaking. We don’t promise fluency or any particular result.
        </p>
      </Section>
      <Section title="Free launch offer">
        <p>
          Every feature is currently free for everyone as a launch offer. There is no paid plan, no payment system and nothing to buy. If paid features are ever introduced, we will announce it clearly first. See <Link className={linkCls} href="/pricing">Free offer</Link>.
        </p>
      </Section>
      <Section title="Content and copyright">
        <p>
          Course content, lessons, design and code are protected by copyright. See <Link className={linkCls} href="/copyright">Copyright & credits</Link> for details and third-party licences.
        </p>
      </Section>
      <Section title="Availability and changes">
        <p>
          We try to keep {SITE_NAME} available and accurate, but it is provided “as is”, without warranties. Features may change or be removed. Your progress is stored in your browser, so clearing browser data can remove it unless you use cloud backup. We may update these terms; the date at the top shows the latest version.
        </p>
      </Section>
      <Section title="Privacy">
        <p>
          How data is handled is described in the <Link className={linkCls} href="/privacy">Privacy policy</Link>.
        </p>
      </Section>
    </InfoPage>
  );
}
