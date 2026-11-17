import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/data/lessons";
import { LessonPlayer } from "@/components/learn/LessonPlayer";

export function generateStaticParams() {
  return lessons.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  return { title: getLesson(lessonId)?.title ?? "Lesson" };
}

export default async function Page({ params }: PageProps<"/learn/[lessonId]">) {
  const { lessonId } = await params;
  if (!getLesson(lessonId)) notFound();
  return <LessonPlayer lessonId={lessonId} />;
}
