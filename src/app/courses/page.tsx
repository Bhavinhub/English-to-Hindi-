import type { Metadata } from "next";
import { CourseLibrary } from "@/components/learn/CourseLibrary";
export const metadata: Metadata = { title: "Courses" };
export default function Page() {
  return <CourseLibrary />;
}
