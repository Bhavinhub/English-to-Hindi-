"use client";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { OfflineBanner } from "./OfflineBanner";
import { CloudSync } from "./CloudSync";

function Inner({ children }: { children: ReactNode }) {
  const { state } = useStore();
  return (
    <MotionConfig reducedMotion={state.prefs.reducedMotion ? "always" : "user"}>
      <a href="#main" className="glass-primary sr-only z-[200] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="ambient" aria-hidden />
      <Navbar />
      <div className="px-3 sm:px-5">
        <OfflineBanner />
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <CloudSync />
    </MotionConfig>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <Inner>{children}</Inner>
    </StoreProvider>
  );
}
