import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const field =
  "glass-inset w-full rounded-2xl px-4 py-3 text-ink placeholder:text-ink-mute outline-none transition focus-visible:border-[var(--violet)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--violet)_30%,transparent)] disabled:opacity-60";

type Labelled = { label?: string; hint?: string; error?: string; hideLabel?: boolean };

export const GlassInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Labelled>(
  function GlassInput({ label, hint, error, hideLabel, className, id, ...rest }, ref) {
    const inputId = id ?? rest.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={cn("mb-1.5 block text-sm font-semibold text-ink-soft", hideLabel && "sr-only")}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(field, "min-h-12", error && "border-danger", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-ink-mute">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-err`} role="alert" className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export const GlassTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Labelled>(
  function GlassTextarea({ label, hint, hideLabel, className, id, ...rest }, ref) {
    const inputId = id ?? rest.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={cn("mb-1.5 block text-sm font-semibold text-ink-soft", hideLabel && "sr-only")}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={inputId} className={cn(field, "resize-y", className)} {...rest} />
        {hint && <p className="mt-1.5 text-xs text-ink-mute">{hint}</p>}
      </div>
    );
  },
);
