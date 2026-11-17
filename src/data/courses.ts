import type { Level } from "@/lib/types";

export type Course = {
  slug: string;
  title: string;
  titleHi: string;
  level: Level | "all";
  levelLabel: string;
  summary: string;
  summaryHi: string;
  outcomes: string[];
  lessonIds: string[];
  tone: "violet" | "sky" | "rose" | "mint" | "amber" | "indigo";
  icon: "Sprout" | "MessagesSquare" | "Puzzle" | "BookOpenText" | "BriefcaseBusiness" | "Mic";
};

export const courses: Course[] = [
  {
    slug: "english-foundations",
    title: "English Foundations",
    titleHi: "अंग्रेज़ी की नींव",
    level: "beginner",
    levelLabel: "Beginner",
    summary: "Greet people, introduce yourself and ask simple questions with confidence.",
    summaryHi: "लोगों से मिलना, अपना परिचय देना और आसान सवाल पूछना सीखें।",
    outcomes: ["Introduce yourself in 3–4 sentences", "Use am / is / are correctly", "Ask What, Where and How questions"],
    lessonIds: ["found-1", "found-2", "found-3"],
    tone: "violet",
    icon: "Sprout",
  },
  {
    slug: "everyday-conversations",
    title: "Everyday Conversations",
    titleHi: "रोज़मर्रा की बातचीत",
    level: "beginner",
    levelLabel: "Beginner",
    summary: "Order food, shop and ask for help using natural, polite English.",
    summaryHi: "खाना ऑर्डर करना, खरीदारी करना और मदद माँगना — विनम्र अंग्रेज़ी में।",
    outcomes: ["Make polite requests with “I’d like…”", "Ask about prices and sizes", "Ask for directions and help"],
    lessonIds: ["every-1", "every-2", "every-3"],
    tone: "sky",
    icon: "MessagesSquare",
  },
  {
    slug: "practical-grammar",
    title: "Practical Grammar",
    titleHi: "काम की ग्रामर",
    level: "elementary",
    levelLabel: "Elementary",
    summary: "Talk about routines, the past and future plans without memorising rules.",
    summaryHi: "रूटीन, बीती बातें और आगे के प्लान — बिना रटे नियमों के।",
    outcomes: ["Describe your daily routine", "Tell a short story about yesterday", "Share plans with will and going to"],
    lessonIds: ["gram-1", "gram-2", "gram-3"],
    tone: "indigo",
    icon: "Puzzle",
  },
  {
    slug: "vocabulary-in-context",
    title: "Vocabulary in Context",
    titleHi: "संदर्भ में शब्दावली",
    level: "elementary",
    levelLabel: "Elementary",
    summary: "Learn useful words through real sentences about feelings, home and time.",
    summaryHi: "भावनाएँ, घर-परिवार और समय से जुड़े शब्द — असली वाक्यों के साथ।",
    outcomes: ["Express how you feel precisely", "Talk about family and home", "Use always, usually and sometimes"],
    lessonIds: ["vocab-1", "vocab-2", "vocab-3"],
    tone: "mint",
    icon: "BookOpenText",
  },
  {
    slug: "workplace-interview-english",
    title: "Workplace and Interview English",
    titleHi: "ऑफ़िस और इंटरव्यू की अंग्रेज़ी",
    level: "intermediate",
    levelLabel: "Intermediate",
    summary: "Answer interview questions, write polite requests and handle work calls.",
    summaryHi: "इंटरव्यू के जवाब, विनम्र रिक्वेस्ट और ऑफ़िस कॉल संभालना सीखें।",
    outcomes: ["Answer “Tell me about yourself”", "Write clear, polite work requests", "Open and close professional calls"],
    lessonIds: ["work-1", "work-2", "work-3"],
    tone: "amber",
    icon: "BriefcaseBusiness",
  },
  {
    slug: "speaking-confidence",
    title: "Speaking Confidence",
    titleHi: "बोलने का आत्मविश्वास",
    level: "all",
    levelLabel: "All levels",
    summary: "Keep conversations going: buy time, ask for repetition and share opinions.",
    summaryHi: "बातचीत चलती रखें: सोचने का समय लें, दोबारा पूछें और अपनी राय दें।",
    outcomes: ["Use thinking phrases instead of silence", "Ask people to repeat or explain", "Give and support an opinion"],
    lessonIds: ["speak-1", "speak-2", "speak-3"],
    tone: "rose",
    icon: "Mic",
  },
];

export const toneClass: Record<Course["tone"], string> = {
  violet: "from-[#8b6cff]/35 to-[#c4b5ff]/10 text-[#5532e0] dark:text-[#c9bcff]",
  sky: "from-[#5fb4f5]/35 to-[#bfe3ff]/10 text-[#1f6fae] dark:text-[#9fd3ff]",
  indigo: "from-[#5b6cff]/30 to-[#b6c0ff]/10 text-[#3442c4] dark:text-[#b3bcff]",
  mint: "from-[#35c49a]/30 to-[#b8f0dc]/10 text-[#0f7653] dark:text-[#7ee8bd]",
  amber: "from-[#f5b041]/35 to-[#ffe6b8]/10 text-[#8a5100] dark:text-[#ffd083]",
  rose: "from-[#f06aa6]/30 to-[#ffc6df]/10 text-[#a8326a] dark:text-[#ffa8cf]",
};

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function courseForLesson(lessonId: string) {
  return courses.find((c) => c.lessonIds.includes(lessonId));
}

export const allLessonIds = courses.flatMap((c) => c.lessonIds);
