import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Floating glass navigation surface. Content is provided by the caller. */
export function GlassNavbar({ children, className, label = "Main" }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <nav aria-label={label} className={cn("glass glass-strong rounded-full px-3 py-2 sm:px-4", className)}>
      {children}
    </nav>
  );
}
