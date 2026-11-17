export type Word = {
  id: string;
  word: string;
  hi: string;
  pos: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  example: string;
  exampleHi: string;
  topic: "Daily life" | "Feelings" | "Work" | "Travel" | "Food" | "Study" | "Conversation";
};

const w = (id: string, word: string, hi: string, pos: Word["pos"], topic: Word["topic"], example: string, exampleHi: string): Word => ({
  id,
  word,
  hi,
  pos,
  topic,
  example,
  exampleHi,
});

export const words: Word[] = [
  w("appointment", "appointment", "मुलाक़ात का तय समय", "noun", "Daily life", "I have a doctor’s appointment at five.", "मेरा पाँच बजे डॉक्टर के साथ अपॉइंटमेंट है।"),
  w("borrow", "borrow", "उधार लेना", "verb", "Daily life", "Can I borrow your pen?", "क्या मैं आपका पेन उधार ले सकता हूँ?"),
  w("lend", "lend", "उधार देना", "verb", "Daily life", "Could you lend me fifty rupees?", "क्या आप मुझे पचास रुपये उधार दे सकते हैं?"),
  w("errand", "errand", "छोटा-मोटा काम (बाहर का)", "noun", "Daily life", "I need to run a few errands this morning.", "मुझे आज सुबह कुछ छोटे काम निपटाने हैं।"),
  w("neighbour", "neighbour", "पड़ोसी", "noun", "Daily life", "Our neighbour waters our plants.", "हमारे पड़ोसी हमारे पौधों को पानी देते हैं।"),
  w("routine", "routine", "दिनचर्या", "noun", "Daily life", "Exercise is part of my morning routine.", "व्यायाम मेरी सुबह की दिनचर्या का हिस्सा है।"),
  w("convenient", "convenient", "सुविधाजनक", "adjective", "Daily life", "Is 4 p.m. convenient for you?", "क्या शाम 4 बजे आपके लिए सुविधाजनक है?"),
  w("nervous", "nervous", "घबराया हुआ", "adjective", "Feelings", "I always feel nervous before exams.", "मैं परीक्षा से पहले हमेशा घबराता हूँ।"),
  w("confident", "confident", "आत्मविश्वासी", "adjective", "Feelings", "She sounds confident on the phone.", "वह फ़ोन पर आत्मविश्वासी लगती है।"),
  w("exhausted", "exhausted", "बहुत थका हुआ", "adjective", "Feelings", "I’m exhausted after the long journey.", "लंबे सफ़र के बाद मैं बहुत थक गया हूँ।"),
  w("grateful", "grateful", "आभारी", "adjective", "Feelings", "I’m grateful for your help.", "मैं आपकी मदद के लिए आभारी हूँ।"),
  w("proud", "proud", "गर्वित", "adjective", "Feelings", "My parents are proud of me.", "मेरे माता-पिता को मुझ पर गर्व है।"),
  w("upset", "upset", "दुखी / परेशान", "adjective", "Feelings", "He was upset about the result.", "वह नतीजे से परेशान था।"),
  w("relieved", "relieved", "राहत महसूस करता हुआ / निश्चिंत", "adjective", "Feelings", "I was relieved when the train arrived.", "ट्रेन आने पर मुझे राहत मिली।"),
  w("deadline", "deadline", "अंतिम समय-सीमा", "noun", "Work", "The deadline for the report is Friday.", "रिपोर्ट की अंतिम तारीख़ शुक्रवार है।"),
  w("colleague", "colleague", "सहकर्मी", "noun", "Work", "My colleague helped me with Excel.", "मेरे सहकर्मी ने Excel में मेरी मदद की।"),
  w("schedule", "schedule", "कार्यक्रम / समय-सारणी", "noun", "Work", "Let me check my schedule.", "मुझे अपना शेड्यूल देखने दीजिए।"),
  w("responsible", "responsible", "ज़िम्मेदार", "adjective", "Work", "I was responsible for customer emails.", "मैं ग्राहकों के ईमेल के लिए ज़िम्मेदार था।"),
  w("experience", "experience", "अनुभव", "noun", "Work", "I have two years of experience in sales.", "मेरे पास सेल्स में दो साल का अनुभव है।"),
  w("strength", "strength", "ताक़त / ख़ूबी", "noun", "Work", "My biggest strength is patience.", "मेरी सबसे बड़ी ख़ूबी धैर्य है।"),
  w("improve", "improve", "सुधारना", "verb", "Work", "I want to improve my English.", "मैं अपनी अंग्रेज़ी सुधारना चाहता हूँ।"),
  w("salary", "salary", "वेतन", "noun", "Work", "The salary is paid on the first of every month.", "वेतन हर महीने की पहली तारीख़ को मिलता है।"),
  w("journey", "journey", "यात्रा", "noun", "Travel", "The journey to Shimla takes eight hours.", "शिमला की यात्रा में आठ घंटे लगते हैं।"),
  w("luggage", "luggage", "सामान", "noun", "Travel", "Please keep your luggage with you.", "कृपया अपना सामान अपने पास रखें।"),
  w("delay", "delay", "देरी", "noun", "Travel", "There is a two-hour delay.", "दो घंटे की देरी है।"),
  w("platform", "platform", "प्लेटफ़ॉर्म", "noun", "Travel", "Which platform does the train leave from?", "ट्रेन किस प्लेटफ़ॉर्म से जाती है?"),
  w("book", "book (a ticket)", "बुक करना", "verb", "Travel", "I booked a ticket online.", "मैंने ऑनलाइन टिकट बुक किया।"),
  w("direction", "direction", "दिशा", "noun", "Travel", "Am I going in the right direction?", "क्या मैं सही दिशा में जा रहा हूँ?"),
  w("spicy", "spicy", "तीखा", "adjective", "Food", "This curry is too spicy for me.", "यह करी मेरे लिए बहुत तीखी है।"),
  w("delicious", "delicious", "स्वादिष्ट", "adjective", "Food", "Your mother’s dal is delicious.", "आपकी माँ की दाल स्वादिष्ट है।"),
  w("order", "order", "ऑर्डर करना / मँगाना", "verb", "Food", "Let’s order some snacks.", "चलो कुछ स्नैक्स मँगाते हैं।"),
  w("bill", "bill", "बिल", "noun", "Food", "Could we have the bill, please?", "क्या हमें बिल मिल सकता है?"),
  w("assignment", "assignment", "असाइनमेंट / गृहकार्य", "noun", "Study", "I finished my assignment last night.", "मैंने कल रात अपना असाइनमेंट पूरा किया।"),
  w("revise", "revise", "दोहराना (पढ़ाई)", "verb", "Study", "I revise my notes every Sunday.", "मैं हर रविवार अपने नोट्स दोहराता हूँ।"),
  w("attend", "attend", "उपस्थित होना", "verb", "Study", "Did you attend the lecture?", "क्या तुम लेक्चर में गए थे?"),
  w("explain", "explain", "समझाना", "verb", "Study", "Could you explain this again?", "क्या आप इसे फिर से समझा सकते हैं?"),
  w("practise", "practise", "अभ्यास करना", "verb", "Study", "I practise speaking for ten minutes daily.", "मैं रोज़ दस मिनट बोलने का अभ्यास करता हूँ।"),
  w("actually", "actually", "असल में", "adverb", "Conversation", "Actually, I’m from Patna, not Delhi.", "असल में, मैं पटना से हूँ, दिल्ली से नहीं।"),
  w("probably", "probably", "शायद (ज़्यादा संभावना)", "adverb", "Conversation", "I’ll probably come by seven.", "मैं शायद सात बजे तक आ जाऊँगा।"),
  w("anyway", "anyway", "ख़ैर / वैसे भी", "adverb", "Conversation", "Anyway, let’s talk about the plan.", "ख़ैर, चलो प्लान के बारे में बात करते हैं।"),
  w("suggest", "suggest", "सुझाव देना", "verb", "Conversation", "Can you suggest a good book?", "क्या आप कोई अच्छी किताब सुझा सकते हैं?"),
  w("agree", "agree", "सहमत होना", "verb", "Conversation", "I agree with you.", "मैं आपसे सहमत हूँ।"),
  w("by-the-way", "by the way", "वैसे / एक बात और", "phrase", "Conversation", "By the way, did you call Ravi?", "वैसे, क्या तुमने रवि को फ़ोन किया?"),
  w("make-sense", "make sense", "समझ में आना / तर्कसंगत होना", "phrase", "Conversation", "Does that make sense?", "क्या यह समझ में आया?"),
  w("figure-out", "figure out", "पता लगाना / समझ लेना", "phrase", "Conversation", "I’ll figure out the bus route.", "मैं बस का रास्ता पता कर लूँगा।"),
];

export const wordTopics = Array.from(new Set(words.map((x) => x.topic)));

export function getWord(id: string) {
  return words.find((x) => x.id === id);
}
