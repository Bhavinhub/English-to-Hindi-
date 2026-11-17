import type { Metadata } from "next";
import { Suspense } from "react";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";
import { Container, Skeleton } from "@/components/common/ui";

export const metadata: Metadata = { title: "Speaking practice" };

export default function Page() {
  return (
    <Suspense
      fallback={
        <Container>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-6 h-96 w-full" />
        </Container>
      }
    >
      <PracticeWorkspace />
    </Suspense>
  );
}
