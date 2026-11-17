"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { backupApi, readBackup, writeBackup } from "@/lib/cloud-backup";

/** When cloud backup is on, saves progress a few seconds after it changes. Does nothing otherwise. */
export function CloudSync() {
  const { state, hydrated } = useStore();
  const first = useRef(true);
  useEffect(() => {
    if (!hydrated) return;
    if (first.current) {
      first.current = false;
      return; // don't upload just because the page loaded
    }
    const info = readBackup();
    if (!info) return;
    const t = setTimeout(() => {
      backupApi
        .save(info.code, state)
        .then((r) => {
          const cur = readBackup();
          if (cur?.code === info.code) writeBackup({ ...cur, lastSaved: r.updatedAt });
        })
        .catch(() => {
          /* offline or unavailable — the next change will retry */
        });
    }, 4000);
    return () => clearTimeout(t);
  }, [state, hydrated]);
  return null;
}
