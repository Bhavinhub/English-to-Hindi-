"use client";
import { useState, type ReactNode } from "react";
import { Volume2, Square, Check, Copy } from "lucide-react";
import { speak, stopSpeaking, useTTSSupported } from "@/lib/speech";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function PageHeader({ eyebrow, title, hi, children }: { eyebrow?: string; title: string; hi?: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-violet">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {hi && <p className="hi mt-1 text-lg text-ink-soft">{hi}</p>}
      {children && <div className="mt-3 max-w-2xl text-ink-soft">{children}</div>}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12", className)}>{children}</div>;
}

export function Pill({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "violet" | "success" | "warn" | "danger"; className?: string }) {
  const tones = {
    neutral: "glass-inset text-ink-soft",
    violet: "bg-violet-soft text-violet border border-[color-mix(in_srgb,var(--violet)_25%,transparent)]",
    success: "bg-success-soft text-success",
    warn: "bg-warn-soft text-warn",
    danger: "bg-danger-soft text-danger",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

/** Listen button: only plays on click (no autoplay), hidden-safe when TTS unsupported. */
export function SpeakButton({ text, lang = "en-IN", label, className, size = "icon" }: { text: string; lang?: string; label?: string; className?: string; size?: "icon" | "sm" }) {
  const supported = useTTSSupported();
  const { state } = useStore();
  const [playing, setPlaying] = useState(false);
  if (!supported) {
    return (
      <span className={cn("text-xs text-ink-mute", className)} title="Speech playback isn't available in this browser">
        Audio unavailable
      </span>
    );
  }
  const onClick = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speak(text, { lang, rate: state.prefs.speechRate, onEnd: () => setPlaying(false) });
  };
  const aria = `${playing ? "Stop" : "Listen to"}: ${label ?? text}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className={cn(
        "glass-inset press inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full text-violet hover:border-[var(--violet)]",
        size === "icon" ? "h-11 w-11" : "min-h-11 px-4 text-sm font-semibold",
        playing && "glass-selected",
        className,
      )}
    >
      {playing ? <Square className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      {size === "sm" && (playing ? "Stop" : "Listen")}
    </button>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Copied" : `Copy: ${text}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="glass-inset press inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-soft hover:text-ink"
    >
      {done ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className="glass-inset h-2.5 w-full overflow-hidden rounded-full">
      <div className="h-full rounded-full bg-gradient-to-r from-[#8b6cff] to-[#4fa8f0] transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("glass-inset animate-pulse rounded-2xl", className)} aria-hidden />;
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="glass-inset flex flex-col items-center rounded-[20px] px-6 py-8 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-violet-soft text-violet">{icon}</div>
      <p className="font-semibold text-ink">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-ink-soft">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Show Hindi/English text depending on the learner's explanation preference. */
export function Explain({ en, hi, className }: { en: string; hi: string; className?: string }) {
  const { state } = useStore();
  const mode = state.profile.explain;
  return (
    <div className={cn("space-y-2", className)}>
      {(mode === "en" || mode === "both") && <p className="leading-relaxed">{en}</p>}
      {(mode === "hi" || mode === "both") && (
        <p lang="hi" className="hi text-ink-soft">
          {hi}
        </p>
      )}
    </div>
  );
}
