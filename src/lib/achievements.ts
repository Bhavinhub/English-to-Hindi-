import type { AppState } from "./types";
import { longestStreak } from "./store";
import { courses } from "@/data/courses";

export type Achievement = { id: string; title: string; hi: string; desc: string; earned: boolean; progress: string };

export function getAchievements(s: AppState): Achievement[] {
  const done = Object.values(s.lessons).filter((l) => l.completedAt).length;
  const streak = longestStreak(s.activity);
  const reviews = Object.values(s.reviews).reduce((a, r) => a + r.reviews, 0);
  const courseDone = courses.some((c) => c.lessonIds.every((id) => s.lessons[id]?.completedAt));
  const saved = s.savedWords.length + s.savedPhrases.length;
  const list: Array<[string, string, string, string, number, number]> = [
    ["first-lesson", "First lesson", "पहला लेसन", "Complete your first lesson.", done, 1],
    ["five-lessons", "Steady learner", "लगातार सीखने वाले", "Complete 5 lessons.", done, 5],
    ["first-practice", "First conversation", "पहली बातचीत", "Finish a speaking practice session.", s.practice.length, 1],
    ["five-practice", "Conversation habit", "बातचीत की आदत", "Finish 5 practice sessions.", s.practice.length, 5],
    ["streak-3", "3-day streak", "3 दिन लगातार", "Learn on 3 days in a row (best streak).", streak, 3],
    ["streak-7", "7-day streak", "7 दिन लगातार", "Learn on 7 days in a row (best streak).", streak, 7],
    ["reviews-20", "Word reviewer", "शब्द दोहराने वाले", "Review 20 flashcards.", reviews, 20],
    ["saved-10", "Collector", "संग्रहकर्ता", "Save 10 words or phrases.", saved, 10],
    ["translate-10", "Translator", "अनुवादक", "Answer 10 Hindi-to-English challenges correctly.", s.translations.correct, 10],
    ["course-1", "Course complete", "कोर्स पूरा", "Finish every lesson in one course.", courseDone ? 1 : 0, 1],
  ];
  return list.map(([id, title, hi, desc, cur, goal]) => ({
    id,
    title,
    hi,
    desc,
    earned: cur >= goal,
    progress: `${Math.min(cur, goal)}/${goal}`,
  }));
}
