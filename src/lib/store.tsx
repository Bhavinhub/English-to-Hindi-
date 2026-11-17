"use client";
/**
 * Guest progress store. Everything lives in localStorage under one key.
 * Integration boundary: replace `storage` with an authenticated API client
 * (see src/lib/persistence.ts) to sync progress to a database later.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { AppState, DayActivity, LessonProgress, PracticeSession, Prefs, Profile, SavedPhrase } from "./types";
import { storage } from "./persistence";

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const defaultState: AppState = {
  version: 1,
  profile: {
    onboarded: false,
    level: null,
    goal: null,
    dailyMinutes: 10,
    explain: "both",
    recommendedCourse: null,
    placement: null,
  },
  prefs: { uiLang: "en", theme: "system", reducedMotion: false, reducedTransparency: false, speechRate: 0.9 },
  lessons: {},
  lastLessonId: null,
  practice: [],
  savedWords: [],
  savedPhrases: [],
  reviews: {},
  translations: { attempts: 0, correct: 0 },
  activity: {},
};

let current: AppState = defaultState;
let loaded = false;
const listeners = new Set<() => void>();

function merge(raw: unknown): AppState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<AppState>;
  return {
    ...defaultState,
    ...r,
    version: 1,
    profile: { ...defaultState.profile, ...r.profile },
    prefs: { ...defaultState.prefs, ...r.prefs },
    translations: { ...defaultState.translations, ...r.translations },
    lessons: r.lessons ?? {},
    practice: Array.isArray(r.practice) ? r.practice : [],
    savedWords: Array.isArray(r.savedWords) ? r.savedWords : [],
    savedPhrases: Array.isArray(r.savedPhrases) ? r.savedPhrases : [],
    reviews: r.reviews ?? {},
    activity: r.activity ?? {},
  };
}

function load(): AppState {
  if (loaded) return current;
  loaded = true;
  current = merge(storage.read()) ?? current;
  return current;
}

function set(updater: (s: AppState) => AppState) {
  current = updater(load());
  storage.write(current);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === storage.key) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const emptyDay: DayActivity = { lessons: 0, practice: 0, reviews: 0, translations: 0, minutes: 0 };
function bump(s: AppState, patch: Partial<DayActivity>): AppState["activity"] {
  const k = todayKey();
  const d = { ...emptyDay, ...s.activity[k] };
  for (const [key, v] of Object.entries(patch) as Array<[keyof DayActivity, number]>) d[key] = Math.round((d[key] + v) * 10) / 10;
  return { ...s.activity, [k]: d };
}

const actions = {
  updateProfile: (p: Partial<Profile>) => set((s) => ({ ...s, profile: { ...s.profile, ...p } })),
  updatePrefs: (p: Partial<Prefs>) => set((s) => ({ ...s, prefs: { ...s.prefs, ...p } })),
  setLessonStep: (id: string, step: number) =>
    set((s) => ({ ...s, lastLessonId: id, lessons: { ...s.lessons, [id]: { ...s.lessons[id], step } } })),
  completeLesson: (id: string, minutes: number, result: Pick<LessonProgress, "exerciseCorrect" | "exerciseTotal">) =>
    set((s) => {
      const already = Boolean(s.lessons[id]?.completedAt);
      return {
        ...s,
        lastLessonId: id,
        lessons: { ...s.lessons, [id]: { ...s.lessons[id], ...result, step: s.lessons[id]?.step ?? 0, completedAt: s.lessons[id]?.completedAt ?? new Date().toISOString() } },
        activity: already ? bump(s, { minutes: Math.max(1, Math.round(minutes / 2)) }) : bump(s, { lessons: 1, minutes }),
      };
    }),
  recordPracticeAnswer: (id: string, index: number, outcome: "correct" | "close" | "incorrect", answer: string) =>
    set((s) => {
      const lp = s.lessons[id] ?? { step: 0 };
      const prev = lp.practice?.[index];
      const entry = { first: prev?.first ?? outcome, answer, solved: (prev?.solved ?? false) || outcome === "correct" };
      return { ...s, lessons: { ...s.lessons, [id]: { ...lp, practice: { ...lp.practice, [index]: entry } } } };
    }),
  toggleBookmark: (id: string) =>
    set((s) => ({ ...s, lessons: { ...s.lessons, [id]: { ...s.lessons[id], step: s.lessons[id]?.step ?? 0, bookmarked: !s.lessons[id]?.bookmarked } } })),
  addPractice: (p: PracticeSession) =>
    set((s) => {
      const mins = Math.max(1, Math.round((new Date(p.endedAt).getTime() - new Date(p.startedAt).getTime()) / 60000));
      return { ...s, practice: [p, ...s.practice].slice(0, 200), activity: bump(s, { practice: 1, minutes: mins }) };
    }),
  toggleWord: (wordId: string) =>
    set((s) => ({
      ...s,
      savedWords: s.savedWords.includes(wordId) ? s.savedWords.filter((w) => w !== wordId) : [...s.savedWords, wordId],
    })),
  savePhrase: (p: Omit<SavedPhrase, "id" | "savedAt">) =>
    set((s) => {
      if (s.savedPhrases.some((x) => x.en.toLowerCase() === p.en.toLowerCase())) return s;
      return { ...s, savedPhrases: [{ ...p, id: `ph-${Date.now()}`, savedAt: new Date().toISOString() }, ...s.savedPhrases] };
    }),
  removePhrase: (id: string) => set((s) => ({ ...s, savedPhrases: s.savedPhrases.filter((p) => p.id !== id) })),
  /** Leitner-style spaced review: boxes 0..5 → 0,1,2,4,7,14 days */
  reviewWord: (wordId: string, gotIt: boolean) =>
    set((s) => {
      const prev = s.reviews[wordId];
      const box = gotIt ? Math.min(5, (prev?.box ?? 0) + 1) : 0;
      const days = [0, 1, 2, 4, 7, 14][box];
      const due = new Date();
      if (days === 0) due.setMinutes(due.getMinutes() + 10);
      else due.setDate(due.getDate() + days);
      return {
        ...s,
        reviews: { ...s.reviews, [wordId]: { box, due: due.toISOString(), reviews: (prev?.reviews ?? 0) + 1, lastReviewed: new Date().toISOString() } },
        activity: bump(s, { reviews: 1, minutes: 0.3 }),
      };
    }),
  recordTranslation: (correct: boolean) =>
    set((s) => ({
      ...s,
      translations: { attempts: s.translations.attempts + 1, correct: s.translations.correct + (correct ? 1 : 0) },
      activity: bump(s, { translations: 1, minutes: 0.5 }),
    })),
  /** Replace everything with a restored backup (keeps this device's appearance settings). */
  importState: (raw: unknown) => {
    const next = merge(raw);
    if (!next) return false;
    set((s) => ({ ...next, prefs: s.prefs }));
    return true;
  },
  resetProgress: () =>
    set((s) => ({ ...defaultState, prefs: s.prefs })),
  resetEverything: () => set(() => defaultState),
};

export type Actions = typeof actions;

type Ctx = { state: AppState; hydrated: boolean; actions: Actions };
const StoreContext = createContext<Ctx | null>(null);

const noopSubscribe = () => () => {};

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, load, () => defaultState);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Apply appearance preferences to <html>
  useEffect(() => {
    const root = document.documentElement;
    const { theme, reducedMotion, reducedTransparency } = state.prefs;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.dataset.theme = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
    };
    apply();
    root.dataset.motion = reducedMotion ? "reduced" : "full";
    root.dataset.transparency = reducedTransparency ? "reduced" : "full";
    // <html lang> stays "en": most content is English; Hindi strings carry lang="hi" themselves
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [state.prefs]);

  const value = useMemo(() => ({ state, hydrated, actions }), [state, hydrated]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Days in a row (ending today or yesterday) with any learning activity. */
export function computeStreak(activity: AppState["activity"]) {
  const active = (k: string) => {
    const d = activity[k];
    return !!d && (d.lessons + d.practice + d.reviews + d.translations > 0 || d.minutes > 0);
  };
  const day = new Date();
  if (!active(todayKey(day))) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (active(todayKey(day))) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

/** Longest run of consecutive active days ever recorded (achievements are never taken away). */
export function longestStreak(activity: AppState["activity"]) {
  const days = Object.entries(activity)
    .filter(([, d]) => d.lessons + d.practice + d.reviews + d.translations > 0 || d.minutes > 0)
    .map(([k]) => k)
    .sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of days) {
    const cur = new Date(`${k}T12:00:00`);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

export function useToday() {
  const { state, hydrated } = useStore();
  // dates are only read on the client, after hydration (keeps prerendering deterministic)
  return hydrated ? (state.activity[todayKey()] ?? emptyDay) : emptyDay;
}
