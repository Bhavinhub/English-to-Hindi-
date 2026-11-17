import type { Metadata } from "next";
import { Translator } from "@/components/practice/Translator";
export const metadata: Metadata = { title: "Hindi to English" };
export default function Page() {
  return <Translator />;
}
