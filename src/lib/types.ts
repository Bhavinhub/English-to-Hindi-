export type Level = "beginner" | "elementary" | "intermediate";
export type Goal = "conversation" | "career" | "interviews" | "travel" | "study";
export type ExplainLang = "hi" | "en" | "both";
export type UiLang = "en" | "hi";
export type ThemePref = "system" | "light" | "dark";

export type Profile = {
  onboarded: boolean;
  level: Level | null;
  goal: Goal | null;
  dailyMinutes: 5 | 10 | 20;
  explain: ExplainLang;
  recommendedCourse: string | null;
  placement: { score: number; total: number; takenAt: string } | null;
};

export type Prefs = {
  uiLang: UiLang;
  theme: ThemePref;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  speechRate: number;
};

export type PracticeAnswer = { first: "correct" | "close" | "incorrect"; answer: string; solved: boolean };

export type LessonProgress = {
  step: number;
  /** Saved practice answers by question index (first-try outcome kept for scoring). */
  practice?: Record<number, PracticeAnswer>;
  completedAt?: string;
  bookmarked?: boolean;
  exerciseCorrect?: number;
  exerciseTotal?: number;
};

export type PracticeSession = {
  id: string;
  topicId: string;
  mode: "demo" | "ai";
  level: Level;
  startedAt: string;
  endedAt: string;
  learnerTurns: number;
  savedPhrases: number;
};

export type SavedPhrase = { id: string; en: string; hi: string; source: "translate" | "practice" | "lesson"; savedAt: string };

export type ReviewState = { box: number; due: string; reviews: number; lastReviewed: string };

export type DayActivity = {
  lessons: number;
  practice: number;
  reviews: number;
  translations: number;
  minutes: number;
};

export type AppState = {
  version: 1;
  profile: Profile;
  prefs: Prefs;
  lessons: Record<string, LessonProgress>;
  lastLessonId: string | null;
  practice: PracticeSession[];
  savedWords: string[];
  savedPhrases: SavedPhrase[];
  reviews: Record<string, ReviewState>;
  translations: { attempts: number; correct: number };
  activity: Record<string, DayActivity>;
};
