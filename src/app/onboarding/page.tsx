import type { Metadata } from "next";
import { Onboarding } from "@/components/learn/Onboarding";
export const metadata: Metadata = { title: "Get started" };
export default function Page() {
  return <Onboarding />;
}
