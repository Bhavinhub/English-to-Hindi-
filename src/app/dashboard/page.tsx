import type { Metadata } from "next";
import { Dashboard } from "@/components/learn/Dashboard";
export const metadata: Metadata = { title: "Dashboard" };
export default function Page() {
  return <Dashboard />;
}
