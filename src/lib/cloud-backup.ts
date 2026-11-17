"use client";
/**
 * Optional cloud backup (Cloudflare D1 via /api/backup). Off until the learner turns it on.
 * The backup code lives only in this browser; the server stores a hash of it.
 */
const CODE_KEY = "bolo-english:backup";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

export type BackupInfo = { code: string; lastSaved: string | null };

export function newBackupCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return chars.match(/.{4}/g)!.join("-");
}

export function normaliseCode(input: string) {
  const c = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.length === 16 ? c.match(/.{4}/g)!.join("-") : input.toUpperCase().trim();
}

export function readBackup(): BackupInfo | null {
  try {
    const raw = localStorage.getItem(CODE_KEY);
    return raw ? (JSON.parse(raw) as BackupInfo) : null;
  } catch {
    return null;
  }
}

export function writeBackup(info: BackupInfo | null) {
  try {
    if (info) localStorage.setItem(CODE_KEY, JSON.stringify(info));
    else localStorage.removeItem(CODE_KEY);
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event("bolo-backup-change"));
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/backup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "The backup service didn’t respond. Please try again.");
  return data;
}

export const backupApi = {
  save: (code: string, data: unknown) => call<{ updatedAt: string }>({ action: "put", code, data }),
  load: (code: string) => call<{ data: unknown; updatedAt: string }>({ action: "get", code }),
  remove: (code: string) => call<{ ok: true }>({ action: "delete", code }),
};
