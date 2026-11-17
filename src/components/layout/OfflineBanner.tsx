"use client";
import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/copy";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export function OfflineBanner() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const { state } = useStore();
  if (online) return null;
  return (
    <div role="status" className="glass glass-strong mx-auto mt-3 flex max-w-6xl items-center gap-2 rounded-2xl px-4 py-3 text-sm text-warn">
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      {t("offline", state.prefs.uiLang)}
    </div>
  );
}
