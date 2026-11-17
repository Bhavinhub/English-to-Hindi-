/** Answer checking that teaches meaning, accepts multiple valid answers and ignores punctuation/case. */
const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'?m\b/g, "i am"],
  [/\byou'?re\b/g, "you are"],
  [/\bwe're\b/g, "we are"],
  [/\bthey'?re\b/g, "they are"],
  [/\bhe's\b/g, "he is"],
  [/\bshe'?s\b/g, "she is"],
  [/\bit's\b/g, "it is"],
  [/\bthat'?s\b/g, "that is"],
  [/\bwhat'?s\b/g, "what is"],
  [/\bwhere's\b/g, "where is"],
  [/\bi'?ve\b/g, "i have"],
  [/\bi'd\b/g, "i would"],
  [/\bi'll\b/g, "i will"],
  [/\bcan'?t\b/g, "cannot"],
  [/\bcan not\b/g, "cannot"],
  [/\bwon't\b/g, "will not"],
  [/\bdon'?t\b/g, "do not"],
  [/\bdoesn'?t\b/g, "does not"],
  [/\bdidn'?t\b/g, "did not"],
  [/\bisn'?t\b/g, "is not"],
  [/\baren'?t\b/g, "are not"],
  [/\bwasn'?t\b/g, "was not"],
  [/\bhaven'?t\b/g, "have not"],
  [/\bcouldn'?t\b/g, "could not"],
  [/\bshouldn'?t\b/g, "should not"],
  [/\blet's\b/g, "let us"],
];

export function normalize(s: string) {
  let t = s.toLowerCase().replace(/[’‘`]/g, "'").trim();
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    // politeness words never make an answer wrong
    .replace(/\b(please|kindly)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

export function similarity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  const max = Math.max(x.length, y.length) || 1;
  return 1 - levenshtein(x, y) / max;
}

export type CheckResult = { status: "correct" | "close" | "incorrect"; best: string; score: number };

export function checkAnswer(input: string, accepted: string[]): CheckResult {
  const n = normalize(input);
  let best = accepted[0];
  let score = 0;
  for (const a of accepted) {
    if (normalize(a) === n) return { status: "correct", best: a, score: 1 };
    const s = similarity(input, a);
    if (s > score) {
      score = s;
      best = a;
    }
  }
  return { status: score >= 0.82 ? "close" : "incorrect", best, score };
}
