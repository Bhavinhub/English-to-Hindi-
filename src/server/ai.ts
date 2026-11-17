import "server-only";
/**
 * Server-side AI provider adapter. Secrets stay on the server.
 * Currently implements Anthropic's Messages API over fetch (no SDK dependency).
 * Add other providers by implementing `ChatProvider`.
 */
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatProvider = { name: string; complete: (system: string, messages: ChatMessage[], maxTokens?: number) => Promise<string> };

function anthropic(): ChatProvider | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.AI_MODEL || "claude-sonnet-5-5";
  return {
    name: "Anthropic",
    async complete(system, messages, maxTokens = 400) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
      });
      if (!res.ok) throw new Error(`AI provider error (${res.status})`);
      const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
      return (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("").trim();
    },
  };
}

export function getProvider(): ChatProvider | null {
  const which = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (which === "anthropic") return anthropic();
  return null;
}

/** Pronunciation assessment isn't implemented; this flag exists so the UI never fakes scores. */
export const pronunciationConfigured = false;
