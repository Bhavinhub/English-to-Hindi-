import type { Goal, Level } from "@/lib/types";

/* ---------------- Launch offer: everything is free ---------------- */
export type OfferFeature = { label: string; note?: string };

export const freeOffer = {
  badge: "Launch offer",
  title: "Everything is free",
  price: "₹0",
  period: "for every learner",
  tagline: "Bolo English is new, so every feature is open to everyone — no card, no account, no trial timer.",
  features: [
    { label: "All 6 courses and 18 complete lessons" },
    { label: "Hindi explanations and bilingual examples" },
    { label: "Speaking practice with Mira (10 real-life topics)" },
    { label: "Natural-voice listening audio for every example" },
    { label: "Hindi-to-English lookup and practice challenge" },
    { label: "Flashcards with spaced review and saved words" },
    { label: "Dashboard, streaks, progress history and achievements" },
    { label: "Optional cloud backup to restore progress on another device" },
    { label: "Open AI conversations and translating any sentence", note: "Turns on when the site owner connects an AI service" },
  ] satisfies OfferFeature[],
  cta: "Start learning free",
};

/* ---------------- FAQ ---------------- */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Is Bolo English free to use?",
    a: "Yes — as a launch offer, every feature is free for everyone. There is no paid plan, no card and no account needed. Your progress is saved in this browser, with optional free cloud backup.",
  },
  {
    q: "Do I need to know any English to start?",
    a: "No. Explanations are available in Hindi, and the Beginner path starts from greetings and simple sentences. You can switch explanations to English, Hindi or both anytime.",
  },
  {
    q: "Is the conversation tutor a real AI?",
    a: "In demo mode, Mira follows curated, branching scripts and every message is labelled as scripted. When a site owner connects an AI service, a separate “Connected AI” mode becomes available and is clearly labelled.",
  },
  {
    q: "Will I get a pronunciation score?",
    a: "Only when a real pronunciation assessment service is connected. We don’t guess pronunciation quality from a text transcript. Different accents are not mistakes — clarity is what matters.",
  },
  {
    q: "Is my voice recorded?",
    a: "Bolo English never stores audio. Speech input uses your browser’s built-in speech service; some browsers (for example Chrome) send the audio to their own servers to convert it to text. You can always type instead.",
  },
  {
    q: "How is my placement result used?",
    a: "The optional five-question activity only suggests a starting course. It is not a certified proficiency test, and you can choose any course you like.",
  },
  {
    q: "Where is my progress stored?",
    a: "In your browser’s local storage on this device. You can clear it anytime from Settings. Cross-device sync needs accounts, which are not enabled in this version.",
  },
];

/* ---------------- Onboarding + placement ---------------- */
export const levelOptions: { id: Level; label: string; hi: string; desc: string }[] = [
  { id: "beginner", label: "Beginner", hi: "शुरुआती", desc: "I know a few words and simple sentences." },
  { id: "elementary", label: "Elementary", hi: "प्रारंभिक", desc: "I understand basics but struggle to speak." },
  { id: "intermediate", label: "Intermediate", hi: "मध्यम", desc: "I can talk, but want to be fluent and professional." },
];

export const goalOptions: { id: Goal; label: string; hi: string; icon: string }[] = [
  { id: "conversation", label: "Daily conversation", hi: "रोज़ की बातचीत", icon: "MessagesSquare" },
  { id: "career", label: "Career growth", hi: "करियर", icon: "TrendingUp" },
  { id: "interviews", label: "Interviews", hi: "इंटरव्यू", icon: "BriefcaseBusiness" },
  { id: "travel", label: "Travel", hi: "यात्रा", icon: "Plane" },
  { id: "study", label: "Study", hi: "पढ़ाई", icon: "GraduationCap" },
];

export const placementQuestions: { q: string; hi: string; options: string[]; answer: string }[] = [
  { q: "Choose the correct sentence.", hi: "सही वाक्य चुनें।", options: ["She are my friend.", "She is my friend.", "She am my friend."], answer: "She is my friend." },
  { q: "“मैं कल बाज़ार गया।” in English:", hi: "", options: ["I go to the market yesterday.", "I went to the market yesterday.", "I going to market yesterday."], answer: "I went to the market yesterday." },
  { q: "Most polite way to ask for water:", hi: "पानी माँगने का सबसे विनम्र तरीक़ा:", options: ["Give water.", "I want water now.", "Could I have some water, please?"], answer: "Could I have some water, please?" },
  { q: "Complete: “I have been working here ___ 2021.”", hi: "", options: ["since", "for", "from"], answer: "since" },
  { q: "In an interview, “What is your biggest strength?” Best start:", hi: "", options: ["I have no weakness.", "My biggest strength is that I stay calm under pressure.", "Strength is good."], answer: "My biggest strength is that I stay calm under pressure." },
];

export function recommendCourse(level: Level | null, goal: Goal | null, score: number | null): string {
  // a very low placement score always starts with the basics, whatever the goal
  if (score !== null && score <= 1) return "english-foundations";
  if (goal === "interviews" || goal === "career") {
    if (level === "intermediate" || (score ?? 0) >= 4) return "workplace-interview-english";
  }
  if (score !== null) {
    if (score <= 1) return "english-foundations";
    if (score <= 3) return goal === "travel" || goal === "conversation" ? "everyday-conversations" : "practical-grammar";
    return goal === "conversation" ? "speaking-confidence" : "vocabulary-in-context";
  }
  if (level === "beginner") return goal === "travel" || goal === "conversation" ? "everyday-conversations" : "english-foundations";
  if (level === "elementary") return goal === "study" ? "practical-grammar" : "everyday-conversations";
  if (level === "intermediate") return "speaking-confidence";
  return "english-foundations";
}
