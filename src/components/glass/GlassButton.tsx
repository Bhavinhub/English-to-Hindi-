"use client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "press inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "glass-primary hover:brightness-110",
  secondary: "glass glass-strong text-ink hover:bg-[var(--glass-bg-strong)] hover:border-[color-mix(in_srgb,var(--violet)_35%,transparent)]",
  ghost: "glass-inset text-ink hover:border-[color-mix(in_srgb,var(--violet)_35%,transparent)]",
  danger: "glass text-danger hover:bg-danger-soft",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-13 px-7 text-base",
  icon: "h-11 w-11 shrink-0",
};

export function glassButtonClass(variant: Variant = "secondary", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  pressed?: boolean;
};

export function GlassButton({
  variant = "secondary",
  size = "md",
  loading,
  icon,
  pressed,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(glassButtonClass(variant, size, className), pressed && "glass-selected")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={pressed}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

export function GlassLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: CommonProps & { href: string; className?: string; children?: ReactNode; "aria-label"?: string; onClick?: () => void }) {
  return (
    <Link href={href} className={glassButtonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
