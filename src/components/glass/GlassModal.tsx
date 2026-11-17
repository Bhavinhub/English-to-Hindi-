"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

export function GlassModal({ open, onClose, title, description, children, footer, size = "md" }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[#0b0d24]/40" aria-hidden onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "glass glass-strong relative max-h-[88vh] w-full overflow-y-auto rounded-[28px] p-6 sm:p-7",
          size === "sm" && "max-w-md",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl",
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-ink-soft">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="glass-inset press grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="text-ink-soft">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
