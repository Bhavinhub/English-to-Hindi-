import type { AppState } from "./types";
import { getLesson } from "@/data/lessons";
import { getTopic } from "@/data/conversations";

export type Event = { at: string; kind: "lesson" | "practice"; title: string; href: string };

export function recentEvents(s: AppState, limit = 6): Event[] {
  const lessons: Event[] = Object.entries(s.lessons)
    .filter(([, p]) => p.completedAt)
    .map(([id, p]) => ({ at: p.completedAt!, kind: "lesson", title: `Completed “${getLesson(id)?.title ?? id}”`, href: `/learn/${id}` }));
  const practice: Event[] = s.practice.map((p) => ({
    at: p.endedAt,
    kind: "practice",
    title: `Practised “${getTopic(p.topicId)?.title ?? p.topicId}” (${p.learnerTurns} replies${p.mode === "demo" ? ", demo" : ""})`,
    href: `/practice?topic=${p.topicId}`,
  }));
  return [...lessons, ...practice].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  const d = Math.floor(diff / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}
