/**
 * Scripted demo-conversation engine (no AI). Shared by the landing preview, the practice
 * page and scripts/collect-audio-lines.mts, so every line Mira can say has a voice clip.
 */
import type { Bi } from "../data/lessons";
import type { Topic } from "../data/conversations";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word / whole-phrase match, so "no" never matches inside "know". */
export function matchesKeyword(reply: string, keyword: string) {
  const text = ` ${reply.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'\s]/g, " ")} `;
  return new RegExp(`\\s${escape(keyword.toLowerCase())}\\s`).test(text.replace(/\s+/g, "  "));
}

export function acknowledgement(topic: Topic, turnIndex: number, reply: string): Bi | undefined {
  const cur = topic.turns[turnIndex];
  if (!cur) return undefined;
  const branch = cur.branches?.find((b) => b.keywords.some((k) => matchesKeyword(reply, k)));
  return branch?.reply ?? cur.fallback;
}

export function join(a: Bi | undefined, b: Bi): Bi {
  return a ? { en: `${a.en} ${b.en}`, hi: `${a.hi} ${b.hi}` } : b;
}

/** Mira's next message after the learner replies to turn `turnIndex`. */
export function tutorReply(topic: Topic, turnIndex: number, reply: string): Bi {
  const ack = acknowledgement(topic, turnIndex, reply);
  const next = topic.turns[turnIndex + 1];
  return join(ack, next ? next.tutor : topic.closing);
}

/** Every message Mira can produce for a topic (used to pre-generate voice clips). */
export function allTutorLines(topic: Topic): Bi[] {
  const out: Bi[] = [topic.turns[0].tutor];
  topic.turns.forEach((turn, i) => {
    const next = topic.turns[i + 1]?.tutor ?? topic.closing;
    const acks = [...(turn.branches ?? []).map((b) => b.reply), ...(turn.fallback ? [turn.fallback] : [])];
    if (acks.length === 0) out.push(next);
    acks.forEach((a) => out.push(join(a, next)));
  });
  return out;
}
