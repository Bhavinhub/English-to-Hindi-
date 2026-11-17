"use client";
import { useEffect, useState } from "react";

export type ServiceStatus = { ai: boolean; translate: boolean; pronunciation: boolean; provider: string | null; cloudBackup: boolean };
const empty: ServiceStatus = { ai: false, translate: false, pronunciation: false, provider: null, cloudBackup: false };
let cache: ServiceStatus | null = null;

/** Asks the server which optional integrations are configured. Secrets never leave the server. */
export function useServiceStatus() {
  const [status, setStatus] = useState<ServiceStatus | null>(cache);
  useEffect(() => {
    if (cache) return;
    let alive = true;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : empty))
      .catch(() => empty)
      .then((s: ServiceStatus) => {
        cache = s;
        if (alive) setStatus(s);
      });
    return () => {
      alive = false;
    };
  }, []);
  return status;
}
