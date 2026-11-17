"use client";
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type GlassTab<T extends string> = { id: T; label: ReactNode; disabled?: boolean };

type Props<T extends string> = {
  tabs: GlassTab<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
  /** id prefix for aria-controls wiring; panels should use `${idPrefix}-panel-${id}` */
  idPrefix?: string;
  /** "tabs" switches content panels; "radio" is a single-choice option picker with no panels. */
  semantics?: "tabs" | "radio";
};

export function GlassTabs<T extends string>({ tabs, value, onChange, label, className, idPrefix = "tabs", semantics = "tabs" }: Props<T>) {
  const radio = semantics === "radio";
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  function onKey(e: KeyboardEvent, index: number) {
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    if (e.key === "Home") next = enabled[0];
    if (e.key === "End") next = enabled[enabled.length - 1];
    if (next !== undefined) {
      e.preventDefault();
      refs.current[next]?.focus();
      onChange(tabs[next].id);
    }
  }
  return (
    <div
      role={radio ? "radiogroup" : "tablist"}
      aria-label={label}
      className={cn("glass no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1", className)}
    >
      {tabs.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role={radio ? "radio" : "tab"}
            type="button"
            id={radio ? undefined : `${idPrefix}-tab-${t.id}`}
            aria-selected={radio ? undefined : active}
            aria-checked={radio ? active : undefined}
            aria-controls={radio ? undefined : `${idPrefix}-panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "press min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition",
              active ? "glass-primary" : "text-ink-soft hover:bg-[var(--glass-bg-inset)] hover:text-ink",
              t.disabled && "opacity-50",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
