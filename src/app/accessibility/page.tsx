import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section, Bullets, linkCls, REPO_URL } from "@/components/common/InfoPage";

export const metadata: Metadata = { title: "Accessibility" };

export default function Page() {
  return (
    <InfoPage title="Accessibility" hi="सुगम्यता" intro="We want everyone to be able to learn with Bolo English, on any device and with any ability.">
      <Section title="What we support">
        <Bullets
          items={[
            "Full keyboard navigation with visible focus, a skip-to-content link and Escape to close dialogs and menus.",
            "Screen-reader labels for buttons, status messages for results and errors, and Hindi text marked as Hindi.",
            "Large touch targets (at least 44 px) and layouts from 360 px phones to large desktops.",
            <>Reduce motion and Reduce transparency settings in <Link className={linkCls} href="/settings">Settings</Link>, plus light and dark themes. Your system’s reduced-motion setting is respected.</>,
            "Every speaking activity can be completed by typing; audio never plays automatically.",
          ]}
        />
      </Section>
      <Section title="Known limitations">
        <Bullets items={["Speech input depends on your browser and is not available everywhere.", "Some interface labels are translated into Hindi, but most screens are in English with Hindi explanations."]} />
      </Section>
      <Section title="Feedback">
        <p>
          Found a barrier? Please tell us on our{" "}
          <a className={linkCls} href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
            GitHub issues page
          </a>{" "}
          and we’ll work on it.
        </p>
      </Section>
    </InfoPage>
  );
}
