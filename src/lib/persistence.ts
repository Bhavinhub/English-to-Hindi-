/**
 * Persistence adapter. Guest mode uses localStorage.
 * To add accounts, implement the same `read`/`write` contract against your
 * auth + database layer (e.g. a /api/progress route) and swap it in here.
 */
const KEY = "bolo-english:v1";

export const storage = {
  key: KEY,
  read(): unknown {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write(value: unknown) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* storage full or blocked — progress stays in memory for this visit */
    }
  },
};
