import { connection } from "next/server";
import { getProvider, pronunciationConfigured } from "@/server/ai";
import { getDB } from "@/server/db";

export async function GET() {
  await connection();
  const p = getProvider();
  const db = await getDB();
  return Response.json({ ai: !!p, translate: !!p, pronunciation: pronunciationConfigured, provider: p?.name ?? null, cloudBackup: !!db });
}
