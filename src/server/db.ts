import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Minimal slice of the Cloudflare D1 API that we use. */
type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<{ meta?: { changes?: number } }>;
};
export type D1Like = { prepare: (sql: string) => D1Statement };

/** Returns the D1 database when running on Cloudflare (or `next dev` with bindings), else null. */
export async function getDB(): Promise<D1Like | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as unknown as { DB?: D1Like }).DB ?? null);
  } catch {
    return null; // e.g. plain `next start` outside Cloudflare
  }
}

export async function hashCode(code: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`bolo-english:${code}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const BACKUP_CODE_RE = /^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){3}$/;
export const MAX_BACKUP_BYTES = 256 * 1024;
