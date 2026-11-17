import Link from "next/link";
import type { ReactNode } from "react";

export const SITE_NAME = "Bolo English";
export const LAST_UPDATED = "17 November 2026";
export const REPO_URL = "https://github.com/Bhavinhub/English-to-Hindi-";

const pages = [
  ["/help", "Help"],
  ["/about", "About"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/accessibility", "Accessibility"],
  ["/copyright", "Copyright & credits"],
] as const;

export function InfoPage({ title, hi, intro, children, updated = true }: { title: string; hi?: string; intro?: ReactNode; children: ReactNode; updated?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Information pages" className="glass h-max rounded-[24px] p-3 lg:sticky lg:top-28">
          <ul className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {pages.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold text-ink-soft hover:bg-[var(--glass-bg-inset)] hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="glass rounded-[28px] p-6 sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
          {hi && <p lang="hi" className="hi mt-1 text-lg text-ink-soft">{hi}</p>}
          {updated && <p className="mt-2 text-sm text-ink-mute">Last updated: {LAST_UPDATED}</p>}
          {intro && <div className="mt-4 text-lg text-ink-soft">{intro}</div>}
          <div className="prose-info mt-6 space-y-8 text-ink-soft">{children}</div>
        </article>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-violet">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

export const linkCls = "font-semibold text-violet underline underline-offset-4";
