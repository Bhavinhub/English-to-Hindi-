/** Centralised bilingual interface copy. Learning content lives in src/data. */
import type { UiLang } from "./types";

const dict = {
  courses: { en: "Courses", hi: "कोर्स" },
  practice: { en: "Speaking Practice", hi: "बोलने की प्रैक्टिस" },
  howItWorks: { en: "How It Works", hi: "कैसे काम करता है" },
  pricing: { en: "Free Offer", hi: "मुफ़्त ऑफ़र" },
  faq: { en: "FAQ", hi: "सवाल-जवाब" },
  startLearning: { en: "Start Learning", hi: "सीखना शुरू करें" },
  home: { en: "Home", hi: "होम" },
  learn: { en: "Learn", hi: "सीखें" },
  practiceShort: { en: "Practice", hi: "प्रैक्टिस" },
  progress: { en: "Progress", hi: "प्रगति" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  translate: { en: "Translate", hi: "अनुवाद" },
  vocabulary: { en: "Vocabulary", hi: "शब्दावली" },
  settings: { en: "Settings", hi: "सेटिंग्स" },
  menu: { en: "Menu", hi: "मेन्यू" },
  closeMenu: { en: "Close menu", hi: "मेन्यू बंद करें" },
  theme: { en: "Toggle theme", hi: "थीम बदलें" },
  language: { en: "Interface language", hi: "इंटरफ़ेस भाषा" },
  offline: { en: "You’re offline. Saved lessons and progress still work; speech input may not.", hi: "आप ऑफ़लाइन हैं। लेसन और प्रगति काम करेंगे; बोलकर लिखना शायद नहीं।" },
  continueLearning: { en: "Continue Learning", hi: "सीखना जारी रखें" },
  todaysGoal: { en: "Today’s Goal", hi: "आज का लक्ष्य" },
  dailySpeaking: { en: "Daily Speaking Practice", hi: "रोज़ की बोलने की प्रैक्टिस" },
  challenge: { en: "Hindi-to-English Challenge", hi: "हिंदी से अंग्रेज़ी चुनौती" },
  vocabReview: { en: "Vocabulary Review", hi: "शब्दावली दोहराएँ" },
  streak: { en: "Current Streak", hi: "लगातार दिन" },
  completed: { en: "Completed Lessons", hi: "पूरे हुए लेसन" },
  recent: { en: "Recent Activity", hi: "हाल की गतिविधि" },
} as const;

export type CopyKey = keyof typeof dict;

export function t(key: CopyKey, lang: UiLang) {
  return dict[key][lang];
}
