"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import manifest from "@/data/audio-manifest.json";
import { audioKey, cleanForSpeech } from "./audio-key";

/* ---------------- Speech synthesis (playback) ---------------- */

/*
 * Playback prefers pre-generated natural-voice clips (public/audio, made with the free
 * edge-tts tool — see scripts/generate_audio.py). Text without a clip (e.g. connected-AI
 * replies) falls back to the browser's built-in speech synthesis.
 */

const clipKeys = new Set<string>(manifest as string[]);
/** Default learner speech rate; clips were recorded at this pace, so it maps to playbackRate 1. */
const BASE_RATE = 0.9;

export function hasClip(text: string) {
  return clipKeys.has(audioKey(text));
}

const noop = () => () => {};
function synthSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
export function useTTSSupported() {
  return useSyncExternalStore(noop, () => synthSupported() || typeof Audio !== "undefined", () => false);
}

/** Prefer clearer, natural-sounding system voices for the fallback, Indian English first. */
function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  const base = lang.split("-")[0];
  const quality = (v: SpeechSynthesisVoice) =>
    (v.lang === lang ? 4 : v.lang.startsWith(base) ? 2 : 0) +
    (/natural|neural|enhanced|premium|google/i.test(v.name) ? 3 : 0) +
    (/neerja|isha|veena|rishi/i.test(v.name) ? 2 : 0);
  return voices.filter((v) => v.lang.startsWith(base)).sort((a, b) => quality(b) - quality(a))[0] ?? null;
}

let currentClip: HTMLAudioElement | null = null;
let currentClipEnd: (() => void) | null = null;
let playToken = 0;

function speakWithSynth(text: string, opts: { lang?: string; rate?: number; onEnd?: () => void }) {
  if (!synthSupported()) {
    opts.onEnd?.();
    return false;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang ?? "en-IN";
  u.rate = opts.rate ?? BASE_RATE;
  const v = pickVoice(u.lang) ?? pickVoice("en-US");
  if (v) u.voice = v;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  playToken++;
  if (currentClip) {
    currentClip.onended = currentClip.onerror = null;
    currentClip.pause();
    currentClip = null;
    const end = currentClipEnd;
    currentClipEnd = null;
    end?.(); // let the interrupted button reset its state
  }
  if (synthSupported()) window.speechSynthesis.cancel();
}

/** Plays a sentence aloud. Only ever called from a user action — never autoplays. */
export function speak(text: string, opts: { lang?: string; rate?: number; onEnd?: () => void } = {}) {
  if (typeof window === "undefined") return false;
  stopSpeaking();
  const clean = cleanForSpeech(text);
  const isEnglish = !opts.lang || opts.lang.startsWith("en");
  if (isEnglish && hasClip(clean)) {
    const token = playToken;
    const audio = new Audio(`/audio/${audioKey(clean)}.mp3`);
    const rate = (opts.rate ?? BASE_RATE) / BASE_RATE;
    audio.playbackRate = Math.min(1.4, Math.max(0.6, rate));
    audio.onended = () => {
      if (token === playToken) {
        currentClip = null;
        currentClipEnd = null;
        opts.onEnd?.();
      }
    };
    let fellBack = false;
    const fallback = () => {
      // both onerror and play() rejection can fire for one failure — only fall back once
      if (token !== playToken || fellBack) return;
      fellBack = true;
      currentClip = null;
      currentClipEnd = null;
      speakWithSynth(clean, opts); // clip missing or blocked — use the browser voice instead
    };
    audio.onerror = fallback;
    currentClip = audio;
    currentClipEnd = opts.onEnd ?? null;
    audio.play().catch(fallback);
    return true;
  }
  return speakWithSynth(clean, opts);
}

/* ---------------- Speech recognition (microphone) ---------------- */

export type MicState = "idle" | "requesting" | "listening" | "processing" | "error";
export type MicError = "denied" | "no-speech" | "network" | "unsupported" | "aborted" | "other";

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onaudiostart: (() => void) | null;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSTTSupported() {
  return useSyncExternalStore(noop, () => getRecognitionCtor() !== null, () => false);
}

/**
 * Microphone input via the browser's Speech Recognition API.
 * - Only starts after an explicit user action (call `start()` from a click).
 * - `stop()` / unmount aborts recognition so the microphone is released.
 */
export function useSpeechRecognition(onFinal: (text: string) => void, lang = "en-IN") {
  const [state, setState] = useState<MicState>("idle");
  const [error, setError] = useState<MicError | null>(null);
  const [interim, setInterim] = useState("");
  const recRef = useRef<RecognitionLike | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef(onFinal);
  useEffect(() => {
    onFinalRef.current = onFinal;
  });
  const supported = useSTTSupported();

  const release = useCallback(() => {
    const r = recRef.current;
    if (r) {
      r.onaudiostart = r.onresult = r.onerror = r.onend = null;
      try {
        r.abort();
      } catch {
        /* already stopped */
      }
    }
    recRef.current = null;
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("unsupported");
      setState("error");
      return;
    }
    release();
    finalRef.current = "";
    setInterim("");
    setError(null);
    setState("requesting");
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onaudiostart = () => setState("listening");
    r.onresult = (e) => {
      let fin = "";
      let tmp = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fin += res[0].transcript;
        else tmp += res[0].transcript;
      }
      if (fin) finalRef.current = fin;
      setInterim(tmp || fin);
    };
    r.onerror = (e) => {
      const map: Record<string, MicError> = {
        "not-allowed": "denied",
        "service-not-allowed": "denied",
        "no-speech": "no-speech",
        network: "network",
        aborted: "aborted",
      };
      const err = map[e.error] ?? "other";
      if (err === "aborted") return;
      setError(err);
      setState("error");
    };
    r.onend = () => {
      const text = finalRef.current.trim();
      recRef.current = null;
      if (text) {
        setState("processing");
        // let the UI show "processing" briefly before handing the transcript over
        setTimeout(() => {
          onFinalRef.current(text);
          setInterim("");
          setState("idle");
        }, 250);
      } else {
        setState((s) => (s === "error" ? s : "idle"));
      }
    };
    recRef.current = r;
    try {
      r.start();
    } catch {
      setError("other");
      setState("error");
    }
  }, [lang, release]);

  const stop = useCallback(() => {
    const r = recRef.current;
    if (r) {
      try {
        r.stop();
      } catch {
        release();
        setState("idle");
      }
    }
  }, [release]);

  const cancel = useCallback(() => {
    release();
    setInterim("");
    setState("idle");
  }, [release]);

  useEffect(() => release, [release]);

  return { supported, state, error, interim, start, stop, cancel, reset: () => { setError(null); setState("idle"); } };
}

export const micErrorText: Record<MicError, { en: string; hi: string }> = {
  denied: {
    en: "Microphone permission was blocked. Allow it from the address bar, or type your answer instead.",
    hi: "माइक्रोफ़ोन की अनुमति बंद है। ब्राउज़र में अनुमति दें या जवाब टाइप करें।",
  },
  "no-speech": { en: "We didn't hear anything. Try again, a little closer to the mic.", hi: "कोई आवाज़ नहीं मिली। फिर से कोशिश करें।" },
  network: {
    en: "The browser's speech service couldn't be reached (it may be offline). Please type instead.",
    hi: "स्पीच सेवा से कनेक्ट नहीं हो पाया। कृपया टाइप करें।",
  },
  unsupported: {
    en: "This browser doesn't support speech input. You can type everything instead.",
    hi: "यह ब्राउज़र बोलकर लिखना सपोर्ट नहीं करता। आप टाइप कर सकते हैं।",
  },
  aborted: { en: "Stopped.", hi: "रोका गया।" },
  other: { en: "Something went wrong with the microphone. Please type instead.", hi: "माइक में समस्या आई। कृपया टाइप करें।" },
};

export const SPEECH_PRIVACY_NOTE =
  "Speech input uses your browser's built-in speech service. In some browsers (for example Chrome), audio is sent to the browser maker's servers to be converted to text. Bolo English does not record or store your audio.";
