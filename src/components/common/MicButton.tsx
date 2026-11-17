"use client";
import { Mic, MicOff, Loader2, Square, AlertCircle } from "lucide-react";
import type { MicState } from "@/lib/speech";
import { cn } from "@/lib/cn";

const labels: Record<MicState, string> = {
  idle: "Start speaking",
  requesting: "Requesting microphone permission…",
  listening: "Listening — tap to stop",
  processing: "Processing what you said…",
  error: "Microphone error — tap to try again",
};

export function MicButton({ state, onStart, onStop, disabled, size = "lg" }: { state: MicState; onStart: () => void; onStop: () => void; disabled?: boolean; size?: "md" | "lg" }) {
  const active = state === "listening" || state === "requesting";
  return (
    <button
      type="button"
      disabled={disabled || state === "processing"}
      onClick={active ? onStop : onStart}
      aria-label={labels[state]}
      aria-pressed={active}
      className={cn(
        "press grid shrink-0 place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-50",
        size === "lg" ? "h-16 w-16" : "h-12 w-12",
        state === "error" ? "glass text-danger" : "glass-primary",
        state === "listening" && "listening-pulse",
      )}
    >
      {state === "requesting" || state === "processing" ? (
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
      ) : state === "listening" ? (
        <Square className="h-5 w-5" aria-hidden />
      ) : state === "error" ? (
        <AlertCircle className="h-6 w-6" aria-hidden />
      ) : disabled ? (
        <MicOff className="h-6 w-6" aria-hidden />
      ) : (
        <Mic className="h-6 w-6" aria-hidden />
      )}
    </button>
  );
}

export const micStatusText: Record<MicState, string> = {
  idle: "Mic is off",
  requesting: "Asking for microphone permission…",
  listening: "Listening…",
  processing: "Processing…",
  error: "Microphone problem",
};
