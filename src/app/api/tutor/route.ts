import { getProvider, type ChatMessage } from "@/server/ai";

type Body = { topic?: string; scenario?: string; level?: string; hindiHints?: boolean; messages?: ChatMessage[] };

export async function POST(req: Request) {
  const provider = getProvider();
  if (!provider) return Response.json({ error: "Connected AI mode isn’t configured on this site. Use demo mode instead." }, { status: 503 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));

  const system = [
    "You are Mira, a warm English speaking-practice partner for Hindi-speaking learners.",
    `Topic: ${String(body.topic ?? "General conversation").slice(0, 80)}. Scenario: ${String(body.scenario ?? "").slice(0, 200)}`,
    `Learner level: ${String(body.level ?? "beginner").slice(0, 20)}. Use short, simple sentences for beginners.`,
    "Reply in 1–3 sentences and end with one question to keep the conversation going.",
    "If the learner makes a mistake, gently model the natural phrasing once. Never treat accent differences as mistakes. Never give pronunciation scores.",
    'Respond ONLY as JSON: {"reply": "<English reply>", "hindiHint": "<the same reply translated to simple Hindi in Devanagari>"}',
  ].join("\n");

  const messages: ChatMessage[] = history.length ? history : [{ role: "user", content: "Please start the conversation." }];
  if (messages[0].role === "assistant") messages.unshift({ role: "user", content: "Please start the conversation." });

  try {
    const raw = await provider.complete(system, messages);
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = match ? (JSON.parse(match[0]) as { reply?: string; hindiHint?: string }) : { reply: raw };
    if (!parsed.reply) throw new Error("Empty reply");
    return Response.json({ reply: parsed.reply, hindiHint: body.hindiHints === false ? undefined : parsed.hindiHint });
  } catch {
    return Response.json({ error: "The AI service didn’t respond. Please try again or use demo mode." }, { status: 502 });
  }
}
