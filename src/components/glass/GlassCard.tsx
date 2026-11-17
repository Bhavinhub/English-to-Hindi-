import { cn } from "@/lib/cn";
import type { HTMLAttributes, ElementType, Ref } from "react";

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  ref?: Ref<HTMLDivElement>;
  /** Use inside another glass surface: keeps the tint and sheen, drops the extra backdrop blur. */
  nested?: boolean;
  interactive?: boolean;
  selected?: boolean;
  strong?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const pad = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" };

export function GlassCard({
  as: Tag = "div",
  nested,
  interactive,
  selected,
  strong,
  padding = "md",
  className,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        nested ? "glass-inset rounded-[20px]" : "glass rounded-[24px]",
        strong && "glass-strong",
        interactive && "glass-hover",
        selected && "glass-selected",
        pad[padding],
        className,
      )}
      {...rest}
    />
  );
}
