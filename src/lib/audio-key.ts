/** Shared by the browser and the audio build script: maps a sentence to its pre-generated clip id. */
export function cleanForSpeech(text: string) {
  return text.replace(/…/g, "").replace(/\s+/g, " ").trim();
}

/** FNV-1a 32-bit hash of the cleaned text, as 8 hex chars. */
export function audioKey(text: string) {
  const s = cleanForSpeech(text).toLowerCase();
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
