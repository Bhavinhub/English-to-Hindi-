import type { Metadata } from "next";
import { InfoPage, Section, Bullets, linkCls, SITE_NAME, REPO_URL } from "@/components/common/InfoPage";

export const metadata: Metadata = { title: "Copyright & credits" };

const credits: Array<[string, string, string]> = [
  ["Inter typeface", "SIL Open Font License 1.1", "https://fonts.google.com/specimen/Inter/license"],
  ["Noto Sans Devanagari typeface", "SIL Open Font License 1.1", "https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari/license"],
  ["Lucide icons", "ISC License", "https://lucide.dev/license"],
  ["Next.js and React", "MIT License", "https://github.com/vercel/next.js/blob/canary/license.md"],
  ["Motion (animation library)", "MIT License", "https://github.com/motiondivision/motion/blob/main/LICENSE.md"],
  ["Tailwind CSS", "MIT License", "https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE"],
  ["edge-tts (voice generation tool)", "LGPL-3.0 / GPL-3.0", "https://github.com/rany2/edge-tts"],
];

export default function Page() {
  return (
    <InfoPage title="Copyright & credits" hi="कॉपीराइट और आभार">
      <Section title="Copyright">
        <p>
          © 2026 {SITE_NAME}. All rights reserved. The {SITE_NAME} name, logo, the tutor character “Mira”, course and lesson content, illustrations and site design are original works protected by copyright. You may use the site for personal learning. Please don’t copy, republish or sell the course content without permission.
        </p>
        <p>
          You’re welcome to share links to any page, and to quote short examples for teaching or review with credit to {SITE_NAME}.
        </p>
      </Section>
      <Section title="Voice audio">
        <p>
          Listening audio was generated with the free, open-source <code>edge-tts</code> tool using Microsoft’s Indian English neural voices (“Neerja” and “Prabhat”). The recordings are used here for learning purposes.
        </p>
      </Section>
      <Section title="Third-party software and fonts">
        <ul className="space-y-2">
          {credits.map(([name, lic, url]) => (
            <li key={name} className="glass-inset flex flex-col gap-1 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-ink">{name}</span>
              <a className={linkCls} href={url} target="_blank" rel="noopener noreferrer">
                {lic}
              </a>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Reporting copyright concerns">
        <Bullets
          items={[
            <>
              If you believe something on this site infringes your copyright, open an issue on our{" "}
              <a className={linkCls} href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
                GitHub page
              </a>{" "}
              describing the material and where it appears. We’ll review and respond.
            </>,
          ]}
        />
      </Section>
    </InfoPage>
  );
}
