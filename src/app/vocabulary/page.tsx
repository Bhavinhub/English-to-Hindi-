import type { Metadata } from "next";
import { Suspense } from "react";
import { Vocabulary } from "@/components/practice/Vocabulary";
import { Container, Skeleton } from "@/components/common/ui";
export const metadata: Metadata = { title: "Vocabulary" };
export default function Page() {
  return (
    <Suspense fallback={<Container><Skeleton className="h-96 w-full" /></Container>}>
      <Vocabulary />
    </Suspense>
  );
}
