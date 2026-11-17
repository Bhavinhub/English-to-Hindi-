"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X, Languages, LayoutDashboard, Languages as Lang2, BookMarked, BarChart3, Settings } from "lucide-react";
import { GlassNavbar, GlassLink } from "@/components/glass";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { t } from "@/lib/copy";
import { cn } from "@/lib/cn";

export function ThemeToggle() {
  const { state, actions } = useStore();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const read = () => setIsDark(document.documentElement.dataset.theme === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return (
    <button
      type="button"
      onClick={() => actions.updatePrefs({ theme: isDark ? "light" : "dark" })}
      aria-label={`${t("theme", state.prefs.uiLang)} (${isDark ? "dark" : "light"})`}
      className="glass-inset press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:text-ink"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}

export function LanguageSwitch() {
  const { state, actions } = useStore();
  const hi = state.prefs.uiLang === "hi";
  return (
    <button
      type="button"
      onClick={() => actions.updatePrefs({ uiLang: hi ? "en" : "hi" })}
      aria-label={`${t("language", state.prefs.uiLang)}: ${hi ? "हिंदी" : "English"}. Switch to ${hi ? "English" : "Hindi"}`}
      className="glass-inset press flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft hover:text-ink"
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span className={hi ? "hi" : ""}>{hi ? "हिं" : "EN"}</span>
    </button>
  );
}

export function Navbar() {
  const { state } = useStore();
  const L = state.prefs.uiLang;
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  // close the mobile menu after navigating (adjust state during render; avoids an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus(); // don't strand keyboard focus
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/courses", label: t("courses", L) },
    { href: "/practice", label: t("practice", L) },
    { href: "/#how-it-works", label: t("howItWorks", L) },
    { href: "/pricing", label: t("pricing", L) },
    { href: "/#faq", label: t("faq", L) },
  ];
  const appLinks = [
    { href: "/dashboard", label: t("dashboard", L), icon: LayoutDashboard },
    { href: "/translate", label: t("translate", L), icon: Lang2 },
    { href: "/vocabulary", label: t("vocabulary", L), icon: BookMarked },
    { href: "/progress", label: t("progress", L), icon: BarChart3 },
    { href: "/settings", label: t("settings", L), icon: Settings },
  ];
  const startHref = state.profile.onboarded ? "/dashboard" : "/onboarding";

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <GlassNavbar className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium text-ink-soft transition hover:bg-[var(--glass-bg-inset)] hover:text-ink",
                  pathname === l.href && "glass-inset text-ink",
                )}
                aria-current={pathname === l.href ? "page" : undefined}
                lang={L}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1.5 sm:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <GlassLink href={startHref} variant="primary" size="sm">
              {state.profile.onboarded ? t("dashboard", L) : t("startLearning", L)}
            </GlassLink>
          </div>
          <button
            type="button"
            ref={toggleRef}
            className="glass-inset press grid h-11 w-11 place-items-center rounded-full text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu", L) : t("menu", L)}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </GlassNavbar>

      {open && (
        <div id="mobile-menu" className="glass glass-strong mx-auto mt-2 max-w-6xl rounded-[24px] p-4 lg:hidden">
          <ul className="grid grid-cols-1 gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} lang={L} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-4 font-semibold text-ink hover:bg-[var(--glass-bg-inset)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-3 h-px bg-[var(--glass-edge)]" />
          <ul className="grid grid-cols-2 gap-2">
            {appLinks.map(({ href, label, icon: I }) => (
              <li key={href}>
                <Link href={href} lang={L} onClick={() => setOpen(false)} className="glass-inset flex min-h-12 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-ink">
                  <I className="h-4 w-4 text-violet" aria-hidden /> {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <LanguageSwitch />
              <ThemeToggle />
            </div>
            <GlassLink href={startHref} variant="primary" size="sm" onClick={() => setOpen(false)}>
              {state.profile.onboarded ? t("dashboard", L) : t("startLearning", L)}
            </GlassLink>
          </div>
        </div>
      )}
    </header>
  );
}
