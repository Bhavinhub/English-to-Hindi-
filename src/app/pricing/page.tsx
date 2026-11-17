import type { Metadata } from "next";
import { Pricing } from "@/components/common/Pricing";
export const metadata: Metadata = { title: "Free launch offer" };
export default function Page() {
  return <Pricing />;
}
