"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/copy";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const { state } = useStore();
  const L = state.prefs.uiLang;
  const pathname = usePathname();
  const home = state.profile.onboarded ? "/dashboard" : "/";
  const items = [
    { href: home, label: t("home", L), icon: Home, match: (p: string) => p === "/" || p === "/dashboard" },
    { href: "/courses", label: t("learn", L), icon: BookOpen, match: (p: string) => p.startsWith("/courses") || p.startsWith("/learn") },
    { href: "/practice", label: t("practiceShort", L), icon: Mic, match: (p: string) => p.startsWith("/practice") },
    { href: "/progress", label: t("progress", L), icon: BarChart3, match: (p: string) => p.startsWith("/progress") },
  ];
  return (
    <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <ul className="glass glass-strong mx-auto grid max-w-md grid-cols-4 gap-1 rounded-[24px] p-1.5">
        {items.map(({ href, label, icon: I, match }) => {
          const active = match(pathname);
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[0.72rem] font-semibold",
                  active ? "glass-primary" : "text-ink-soft hover:text-ink",
                )}
              >
                <I className="h-5 w-5" aria-hidden />
                <span lang={L} className={L === "hi" ? "hi leading-tight" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
