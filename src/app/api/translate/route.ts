import { getProvider } from "@/server/ai";

export async function POST(req: Request) {
  const provider = getProvider();
  if (!provider) return Response.json({ error: "Translating any sentence requires a connected translation service." }, { status: 503 });
  let text = "";
  try {
    text = String((await req.json()).text ?? "").slice(0, 300);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!text.trim()) return Response.json({ error: "Please enter a sentence." }, { status: 400 });
  const system =
    'You help Hindi speakers learn English. Translate the Hindi (Devanagari or Romanized) into natural, everyday English. Respond ONLY as JSON: {"en": "<natural English>", "alts": ["<alternative>"], "explanation": "<one short grammar note in simple English>", "explanationHi": "<the same note in simple Hindi>"}';
  try {
    const raw = await provider.complete(system, [{ role: "user", content: text }], 300);
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("bad");
    return Response.json(JSON.parse(match[0]));
  } catch {
    return Response.json({ error: "The translation service didn’t respond. Please try again." }, { status: 502 });
  }
}
