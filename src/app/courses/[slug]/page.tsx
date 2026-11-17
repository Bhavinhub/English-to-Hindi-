import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/data/courses";
import { CourseDetail } from "@/components/learn/CourseDetail";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCourse(slug)?.title ?? "Course" };
}

export default async function Page({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  if (!getCourse(slug)) notFound();
  return <CourseDetail slug={slug} />;
}
