import { BACKUP_CODE_RE, MAX_BACKUP_BYTES, getDB, hashCode } from "@/server/db";

type Body = { action?: "get" | "put" | "delete"; code?: string; data?: unknown };

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

/** Opt-in cloud backup of guest progress, keyed by a random backup code (sent in the body, never the URL). */
export async function POST(req: Request) {
  const db = await getDB();
  if (!db) return json({ error: "Cloud backup isn’t available on this copy of the site." }, 503);

  const raw = await req.text();
  if (raw.length > MAX_BACKUP_BYTES + 1024) return json({ error: "Backup is too large." }, 413);
  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const code = String(body.code ?? "").toUpperCase().trim();
  if (!BACKUP_CODE_RE.test(code)) return json({ error: "That backup code isn’t valid. It looks like ABCD-EFGH-JKLM-NPQR." }, 400);
  const key = await hashCode(code);
  const now = new Date().toISOString();

  try {
    if (body.action === "get") {
      const row = await db.prepare("SELECT data, updated_at FROM progress_backups WHERE code_hash = ?").bind(key).first<{ data: string; updated_at: string }>();
      if (!row) return json({ error: "No backup was found for that code." }, 404);
      return json({ data: JSON.parse(row.data), updatedAt: row.updated_at });
    }
    if (body.action === "put") {
      const data = body.data;
      if (!data || typeof data !== "object" || (data as { version?: unknown }).version !== 1) return json({ error: "Invalid progress data." }, 400);
      const text = JSON.stringify(data);
      if (text.length > MAX_BACKUP_BYTES) return json({ error: "Backup is too large." }, 413);
      await db
        .prepare(
          "INSERT INTO progress_backups (code_hash, data, version, created_at, updated_at) VALUES (?, ?, 1, ?, ?) ON CONFLICT(code_hash) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
        )
        .bind(key, text, now, now)
        .run();
      return json({ ok: true, updatedAt: now });
    }
    if (body.action === "delete") {
      await db.prepare("DELETE FROM progress_backups WHERE code_hash = ?").bind(key).run();
      return json({ ok: true });
    }
    return json({ error: "Unknown action." }, 400);
  } catch {
    return json({ error: "The backup service had a problem. Please try again." }, 500);
  }
}
