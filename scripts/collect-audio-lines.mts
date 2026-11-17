/**
 * Collects every fixed English line the app can play aloud and writes:
 *   scripts/audio-lines.json      — [{ key, text, voice }] for the generator
 *   src/data/audio-manifest.json  — list of clip ids the browser can play
 * Run: npm run audio:collect  (Node 22.6+ with type stripping)
 */
import { writeFileSync } from "node:fs";
import { lessons } from "../src/data/lessons.ts";
import { words } from "../src/data/vocabulary.ts";
import { phrases } from "../src/data/phrases.ts";
import { topics } from "../src/data/conversations.ts";
import { audioKey, cleanForSpeech } from "../src/lib/audio-key.ts";
import { allTutorLines } from "../src/lib/demo-engine.ts";

const FEMALE = "en-IN-NeerjaNeural";
const MALE = "en-IN-PrabhatNeural";
const MALE_SPEAKERS = new Set([
  "Aman", "Kabir", "Sameer", "Guard", "Arjun", "Vikram", "Dev", "Ankit", "Nikhil", "Rohan", "Harsh", "Ali",
  "Rakesh", "Farhan", "Varun", "Yash", "Waiter", "Seller", "Manager", "Agent",
]);

const lines = new Map<string, { key: string; text: string; voice: string }>();
function add(text: string | undefined, voice = FEMALE) {
  if (!text) return;
  const clean = cleanForSpeech(text);
  if (!clean || !/[a-z]/i.test(clean)) return;
  const key = audioKey(clean);
  if (!lines.has(key)) lines.set(key, { key, text: clean, voice });
}

for (const l of lessons) {
  l.examples.forEach((e) => { add(e.en); add(e.alt); });
  l.dialogue.lines.forEach((d) => add(d.en, MALE_SPEAKERS.has(d.speaker) ? MALE : FEMALE));
  add(l.speaking.sample);
}
for (const w of words) { add(w.word); add(w.example); }
for (const p of phrases) { add(p.en); p.alts.forEach((a) => add(a)); }
for (const t of topics) {
  // Mira's lines exactly as the demo engine composes them
  allTutorLines(t).forEach((l) => add(l.en));
  t.turns.forEach((turn) => add(turn.usefulPhrase.en));
}

const list = [...lines.values()];
writeFileSync(new URL("./audio-lines.json", import.meta.url), JSON.stringify(list, null, 1));
writeFileSync(new URL("../src/data/audio-manifest.json", import.meta.url), JSON.stringify(list.map((l) => l.key).sort()));
console.log(`${list.length} lines (${list.filter((l) => l.voice === MALE).length} male voice)`);
