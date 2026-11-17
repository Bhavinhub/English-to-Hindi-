import Link from "next/link";
import { LogoMark } from "./Logo";

const cols = [
  { title: "Learn", links: [["Courses", "/courses"], ["Lessons dashboard", "/dashboard"], ["Vocabulary", "/vocabulary"], ["Progress", "/progress"]] },
  { title: "Practise", links: [["Speaking practice", "/practice"], ["Hindi to English", "/translate"], ["Placement activity", "/onboarding"]] },
  { title: "Bolo English", links: [["About", "/about"], ["Free offer", "/pricing"], ["Help centre", "/help"], ["Settings & data", "/settings"]] },
];

export function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-4 pb-28 sm:px-6 md:pb-10">
      <div className="glass rounded-[28px] p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-ink">
              <LogoMark className="h-8 w-8" /> Bolo English
            </div>
            <p className="mt-3 text-sm text-ink-soft">Learn English with help from Hindi, and practise speaking every day.</p>
            <p className="hi mt-1 text-sm text-ink-mute">हिंदी की मदद से अंग्रेज़ी सीखें।</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="text-sm font-bold text-ink">{c.title}</h2>
              <ul className="mt-2 space-y-0.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-11 items-center text-sm text-ink-soft hover:text-violet">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--glass-edge)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-mute">© 2026 Bolo English. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-4">
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Accessibility", "/accessibility"], ["Copyright & credits", "/copyright"], ["Help", "/help"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center text-xs font-semibold text-ink-soft hover:text-violet">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-xs text-ink-mute">Placement results are a suggested starting point, not a certified assessment.</p>
      </div>
    </footer>
  );
}
