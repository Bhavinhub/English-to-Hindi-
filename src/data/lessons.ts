import { withExtra } from "./accepted-extra";

export type Bi = { en: string; hi: string };
export type Example = { hi: string; en: string; alt?: string; note?: string };
export type PatternItem = { prompt: string; options: string[]; answer: string; explain: string };
export type ExerciseItem =
  | { kind: "mcq"; prompt: string; promptHi?: string; options: string[]; answer: string; feedback: string }
  | { kind: "translate"; hi: string; accepted: string[]; feedback: string };
export type DialogueLine = { speaker: string; en: string; hi: string };

export type Lesson = {
  id: string;
  title: string;
  titleHi: string;
  minutes: number;
  objective: Bi;
  explanation: Bi;
  examples: Example[];
  pattern: { title: string; instruction: Bi; items: PatternItem[] };
  dialogue: { context: string; lines: DialogueLine[] };
  exercise: ExerciseItem[];
  speaking: { prompt: Bi; sample: string; tip: Bi };
  recap: string[];
};

const rawLessons: Lesson[] = [
  /* ============ 1. English Foundations ============ */
  {
    id: "found-1",
    title: "Greetings and introductions",
    titleHi: "अभिवादन और परिचय",
    minutes: 8,
    objective: {
      en: "Greet someone and introduce yourself with your name, city and what you do.",
      hi: "किसी से मिलते समय अभिवादन करें और अपना नाम, शहर और काम बताएँ।",
    },
    explanation: {
      en: "In English we usually greet first (“Hi”, “Good morning”), then share our name with “My name is…” or “I’m…”. “Nice to meet you” is said when you meet someone for the first time.",
      hi: "अंग्रेज़ी में पहले अभिवादन करते हैं (“Hi”, “Good morning”), फिर “My name is…” या “I’m…” से नाम बताते हैं। पहली बार मिलने पर “Nice to meet you” कहते हैं — इसका मतलब है “आपसे मिलकर अच्छा लगा।”",
    },
    examples: [
      { hi: "नमस्ते, मेरा नाम प्रिया है।", en: "Hi, my name is Priya.", alt: "Hello, I’m Priya." },
      { hi: "मैं जयपुर से हूँ।", en: "I’m from Jaipur.", alt: "I come from Jaipur." },
      { hi: "मैं एक छात्र हूँ।", en: "I’m a student.", note: "Use “a” before jobs: a student, a teacher, an engineer." },
      { hi: "आपसे मिलकर अच्छा लगा।", en: "Nice to meet you.", alt: "It’s nice to meet you." },
    ],
    pattern: {
      title: "Build your introduction",
      instruction: { en: "Choose the word that completes each sentence.", hi: "हर वाक्य के लिए सही शब्द चुनें।" },
      items: [
        { prompt: "My ___ is Rahul.", options: ["name", "names", "named"], answer: "name", explain: "“My name is…” — name is singular here." },
        { prompt: "I come ___ Lucknow.", options: ["in", "from", "at"], answer: "from", explain: "We come “from” a place: I come from Lucknow / I’m from Lucknow." },
        { prompt: "I’m ___ engineer.", options: ["a", "an", "the"], answer: "an", explain: "“an” comes before vowel sounds: an engineer, an artist." },
      ],
    },
    dialogue: {
      context: "Two people meet at a training session.",
      lines: [
        { speaker: "Aman", en: "Hi! I’m Aman. What’s your name?", hi: "नमस्ते! मैं अमन हूँ। आपका नाम क्या है?" },
        { speaker: "Neha", en: "Hi Aman, I’m Neha. Nice to meet you.", hi: "नमस्ते अमन, मैं नेहा हूँ। आपसे मिलकर अच्छा लगा।" },
        { speaker: "Aman", en: "Nice to meet you too. Where are you from?", hi: "मुझे भी। आप कहाँ से हैं?" },
        { speaker: "Neha", en: "I’m from Indore. I work in a bank.", hi: "मैं इंदौर से हूँ। मैं एक बैंक में काम करती हूँ।" },
      ],
    },
    exercise: [
      {
        kind: "translate",
        hi: "मेरा नाम रवि है।",
        accepted: ["My name is Ravi.", "I am Ravi.", "I'm Ravi."],
        feedback: "Both “My name is Ravi” and “I’m Ravi” are natural.",
      },
      {
        kind: "mcq",
        prompt: "You meet someone for the first time. What do you say?",
        promptHi: "किसी से पहली बार मिल रहे हैं। क्या कहेंगे?",
        options: ["Nice to meet you.", "Nice to see you again.", "Goodbye."],
        answer: "Nice to meet you.",
        feedback: "“Nice to see you again” is for people you already know.",
      },
      {
        kind: "translate",
        hi: "मैं दिल्ली से हूँ।",
        accepted: ["I am from Delhi.", "I'm from Delhi.", "I come from Delhi."],
        feedback: "“from” shows where you come from.",
      },
    ],
    speaking: {
      prompt: { en: "Introduce yourself: your name, your city and what you do.", hi: "अपना परिचय दें: नाम, शहर और आप क्या करते हैं।" },
      sample: "Hi, I’m Sana. I’m from Bhopal. I’m a college student and I’m learning English.",
      tip: { en: "Speak slowly and smile — clarity matters more than speed.", hi: "धीरे बोलें — तेज़ बोलने से ज़्यादा ज़रूरी है साफ़ बोलना।" },
    },
    recap: ["Greet first: Hi / Hello / Good morning.", "My name is… / I’m…", "I’m from + place.", "I’m a/an + job."],
  },
  {
    id: "found-2",
    title: "Using am, is and are",
    titleHi: "am, is और are का प्रयोग",
    minutes: 10,
    objective: {
      en: "Choose am, is or are to describe people, things and feelings.",
      hi: "लोगों, चीज़ों और भावनाओं के बारे में बताने के लिए am, is या are चुनें।",
    },
    explanation: {
      en: "am, is and are all mean “to be”. Use “am” with I, “is” with he / she / it / one person or thing, and “are” with you / we / they / many things.",
      hi: "am, is, are — तीनों का मतलब “होना” (हूँ, है, हैं) है। I के साथ am, he / she / it या एक चीज़ के साथ is, और you / we / they या कई चीज़ों के साथ are लगता है।",
    },
    examples: [
      { hi: "मैं थका हुआ हूँ।", en: "I am tired.", alt: "I’m tired." },
      { hi: "वह मेरी बहन है।", en: "She is my sister.", alt: "She’s my sister." },
      { hi: "हम तैयार हैं।", en: "We are ready.", alt: "We’re ready." },
      { hi: "यह फ़ोन नया है।", en: "This phone is new." },
      { hi: "आप बहुत मददगार हैं।", en: "You are very helpful.", note: "“You” always takes “are”, even for one person." },
    ],
    pattern: {
      title: "Pick the right form",
      instruction: { en: "Choose am, is or are.", hi: "am, is या are चुनें।" },
      items: [
        { prompt: "They ___ my friends.", options: ["am", "is", "are"], answer: "are", explain: "They = more than one person → are." },
        { prompt: "My father ___ a driver.", options: ["am", "is", "are"], answer: "is", explain: "One person (he) → is." },
        { prompt: "I ___ happy today.", options: ["am", "is", "are"], answer: "am", explain: "I always takes am." },
        { prompt: "You ___ late.", options: ["am", "is", "are"], answer: "are", explain: "You → are, always." },
      ],
    },
    dialogue: {
      context: "Friends chatting before class.",
      lines: [
        { speaker: "Riya", en: "Are you ready for the test?", hi: "क्या तुम टेस्ट के लिए तैयार हो?" },
        { speaker: "Kabir", en: "Yes, I am. But I’m a little nervous.", hi: "हाँ, हूँ। लेकिन थोड़ा घबराया हुआ हूँ।" },
        { speaker: "Riya", en: "Don’t worry. The questions are easy.", hi: "चिंता मत करो। सवाल आसान हैं।" },
        { speaker: "Kabir", en: "Thanks! You are always so positive.", hi: "धन्यवाद! तुम हमेशा इतनी पॉज़िटिव रहती हो।" },
      ],
    },
    exercise: [
      {
        kind: "translate",
        hi: "वे मेरे दोस्त हैं।",
        accepted: ["They are my friends.", "They're my friends."],
        feedback: "They → are.",
      },
      {
        kind: "mcq",
        prompt: "Which sentence is correct?",
        options: ["He are a teacher.", "He is a teacher.", "He am a teacher."],
        answer: "He is a teacher.",
        feedback: "He / she / it → is.",
      },
      {
        kind: "translate",
        hi: "मैं खुश हूँ।",
        accepted: ["I am happy.", "I'm happy."],
        feedback: "I → am. “I’m” is the short, everyday form.",
      },
    ],
    speaking: {
      prompt: { en: "Describe three people in your life using am / is / are.", hi: "am / is / are से अपनी ज़िंदगी के तीन लोगों के बारे में बताएँ।" },
      sample: "My mother is very kind. My brothers are funny. I am the youngest in my family.",
      tip: { en: "Use short forms (I’m, she’s) — they sound more natural in speech.", hi: "बोलते समय I’m, she’s जैसे छोटे रूप ज़्यादा स्वाभाविक लगते हैं।" },
    },
    recap: ["I → am", "He / she / it / one thing → is", "You / we / they / many things → are", "Short forms: I’m, she’s, we’re"],
  },
  {
    id: "found-3",
    title: "Asking simple questions",
    titleHi: "आसान सवाल पूछना",
    minutes: 9,
    objective: {
      en: "Ask What, Where and How questions in the correct order.",
      hi: "What, Where और How से सही क्रम में सवाल पूछें।",
    },
    explanation: {
      en: "In English questions, the question word comes first, then is / are, then the subject: “Where is the station?” — not “Station is where?”. Hindi puts the question word in the middle, so this order needs practice.",
      hi: "अंग्रेज़ी सवाल में पहले प्रश्न-शब्द (What / Where / How), फिर is / are, फिर बाक़ी हिस्सा आता है: “Where is the station?” हिंदी में “स्टेशन कहाँ है?” में ‘कहाँ’ बीच में आता है, इसलिए इस क्रम की प्रैक्टिस ज़रूरी है।",
    },
    examples: [
      { hi: "आपका नाम क्या है?", en: "What is your name?", alt: "What’s your name?" },
      { hi: "बाथरूम कहाँ है?", en: "Where is the washroom?", alt: "Where’s the restroom?", note: "In India “washroom” is common; “restroom” is also understood." },
      { hi: "आप कैसे हैं?", en: "How are you?" },
      { hi: "यह कितने का है?", en: "How much is this?" },
    ],
    pattern: {
      title: "Question word first",
      instruction: { en: "Choose the question word that fits.", hi: "सही प्रश्न-शब्द चुनें।" },
      items: [
        { prompt: "___ is your phone number?", options: ["What", "Where", "How"], answer: "What", explain: "Asking for information → What." },
        { prompt: "___ is the bus stop?", options: ["What", "Where", "How"], answer: "Where", explain: "Asking about a place → Where." },
        { prompt: "___ old are you?", options: ["What", "Where", "How"], answer: "How", explain: "“How old” asks about age." },
      ],
    },
    dialogue: {
      context: "At a new office on the first day.",
      lines: [
        { speaker: "Sameer", en: "Excuse me, where is the HR department?", hi: "माफ़ कीजिए, HR विभाग कहाँ है?" },
        { speaker: "Guard", en: "It’s on the second floor.", hi: "वह दूसरी मंज़िल पर है।" },
        { speaker: "Sameer", en: "Thank you. And what time is lunch?", hi: "धन्यवाद। और लंच कितने बजे होता है?" },
        { speaker: "Guard", en: "Lunch is at one o’clock.", hi: "लंच एक बजे होता है।" },
      ],
    },
    exercise: [
      {
        kind: "translate",
        hi: "स्टेशन कहाँ है?",
        accepted: ["Where is the station?", "Where's the station?", "Where is the railway station?"],
        feedback: "Question word first: Where is the station?",
      },
      {
        kind: "mcq",
        prompt: "Which question is in the correct order?",
        options: ["Your name is what?", "What is your name?", "What your name is?"],
        answer: "What is your name?",
        feedback: "Question word → is → subject.",
      },
      {
        kind: "translate",
        hi: "आप कैसे हैं?",
        accepted: ["How are you?", "How are you doing?"],
        feedback: "“How are you?” is the most common greeting question.",
      },
    ],
    speaking: {
      prompt: { en: "You are new in a city. Ask three questions to a shopkeeper.", hi: "आप नए शहर में हैं। एक दुकानदार से तीन सवाल पूछें।" },
      sample: "Excuse me, where is the nearest ATM? How much is this water bottle? What time do you close?",
      tip: { en: "Start with “Excuse me” — it’s polite and gets attention.", hi: "“Excuse me” से शुरू करें — यह विनम्र है।" },
    },
    recap: ["What → information", "Where → place", "How → manner, age, price", "Order: Question word + is/are + subject"],
  },

  /* ============ 2. Everyday Conversations ============ */
  {
    id: "every-1",
    title: "Ordering food politely",
    titleHi: "विनम्रता से खाना ऑर्डर करना",
    minutes: 9,
    objective: {
      en: "Order food and drinks using “I’d like…” and “Could I have…?”.",
      hi: "“I’d like…” और “Could I have…?” से खाना और ड्रिंक ऑर्डर करें।",
    },
    explanation: {
      en: "“I want” is correct but can sound direct. “I would like” (I’d like) and “Could I have…?” are polite ways to make a request — perfect for restaurants and shops.",
      hi: "“I want” सही है, पर थोड़ा सीधा लग सकता है। “I would like” (I’d like) और “Could I have…?” अनुरोध करने के विनम्र तरीक़े हैं — रेस्टोरेंट और दुकानों के लिए बढ़िया।",
    },
    examples: [
      { hi: "मुझे एक गिलास पानी चाहिए।", en: "I would like a glass of water.", alt: "I need a glass of water.", note: "“I would like” is a polite way to make a request." },
      { hi: "क्या मुझे मेन्यू मिल सकता है?", en: "Could I have the menu, please?", alt: "Can I see the menu, please?" },
      { hi: "मैं एक मसाला डोसा लूँगा।", en: "I’ll have a masala dosa.", note: "“I’ll have…” is a natural way to order." },
      { hi: "कम तीखा, प्लीज़।", en: "Less spicy, please.", alt: "Not too spicy, please." },
      { hi: "बिल ला दीजिए।", en: "Could we have the bill, please?", alt: "Can I get the bill, please?" },
    ],
    pattern: {
      title: "Polite request patterns",
      instruction: { en: "Complete the polite request.", hi: "विनम्र अनुरोध पूरा करें।" },
      items: [
        { prompt: "I’d ___ a cup of tea, please.", options: ["like", "want to", "liking"], answer: "like", explain: "I’d like + thing." },
        { prompt: "Could I ___ the bill?", options: ["have", "having", "had"], answer: "have", explain: "Could I + base verb: Could I have…" },
        { prompt: "I’ll ___ the paneer tikka.", options: ["have", "has", "to have"], answer: "have", explain: "I’ll have… = I’m choosing this." },
      ],
    },
    dialogue: {
      context: "At a small restaurant.",
      lines: [
        { speaker: "Waiter", en: "Good evening! Are you ready to order?", hi: "शुभ संध्या! क्या आप ऑर्डर करने के लिए तैयार हैं?" },
        { speaker: "Pooja", en: "Yes. I’d like a veg thali, please.", hi: "हाँ। मुझे एक वेज थाली चाहिए।" },
        { speaker: "Waiter", en: "Sure. Anything to drink?", hi: "ज़रूर। पीने के लिए कुछ?" },
        { speaker: "Pooja", en: "Could I have a sweet lassi?", hi: "क्या मुझे एक मीठी लस्सी मिल सकती है?" },
        { speaker: "Waiter", en: "Of course. It’ll be ready in ten minutes.", hi: "बिलकुल। दस मिनट में तैयार हो जाएगा।" },
      ],
    },
    exercise: [
      {
        kind: "translate",
        hi: "मुझे एक गिलास पानी चाहिए।",
        accepted: ["I would like a glass of water.", "I'd like a glass of water.", "I need a glass of water.", "Could I have a glass of water?", "Can I have a glass of water?", "I want a glass of water."],
        feedback: "“I’d like a glass of water, please” is the most polite choice.",
      },
      {
        kind: "mcq",
        prompt: "Which is the most polite way to ask for the menu?",
        options: ["Give menu.", "Could I have the menu, please?", "Menu, now."],
        answer: "Could I have the menu, please?",
        feedback: "Could I… + please = polite and friendly.",
      },
      {
        kind: "translate",
        hi: "बिल ला दीजिए।",
        accepted: ["Could we have the bill, please?", "Could I have the bill, please?", "Can I get the bill, please?", "Can we have the bill?", "The bill, please."],
        feedback: "Many polite versions are correct.",
      },
    ],
    speaking: {
      prompt: { en: "Order a meal and a drink, and ask for less spice.", hi: "एक खाना और एक ड्रिंक ऑर्डर करें, और कम मसाला माँगें।" },
      sample: "I’d like a paneer roll and a cold coffee, please. Could you make it less spicy?",
      tip: { en: "Add “please” at the end — it’s simple and always polite.", hi: "अंत में “please” जोड़ें — हमेशा विनम्र लगता है।" },
    },
    recap: ["I’d like + thing", "Could I have…?", "I’ll have… (when choosing)", "Add “please” for politeness"],
  },
  {
    id: "every-2",
    title: "Shopping and prices",
    titleHi: "खरीदारी और दाम",
    minutes: 8,
    objective: { en: "Ask about price, size and colour, and say yes or no politely.", hi: "दाम, साइज़ और रंग के बारे में पूछें, और विनम्रता से हाँ या ना कहें।" },
    explanation: {
      en: "Use “How much is this?” for one item and “How much are these?” for more than one. To ask for another option, say “Do you have this in…?” To say no politely: “I’ll think about it, thanks.”",
      hi: "एक चीज़ के लिए “How much is this?” और कई चीज़ों के लिए “How much are these?” बोलें। दूसरा विकल्प माँगने के लिए “Do you have this in…?” कहें। विनम्रता से मना करने के लिए: “I’ll think about it, thanks.”",
    },
    examples: [
      { hi: "यह कितने का है?", en: "How much is this?", alt: "What’s the price of this?" },
      { hi: "क्या यह बड़े साइज़ में है?", en: "Do you have this in a larger size?", alt: "Is this available in a bigger size?" },
      { hi: "क्या मैं इसे पहनकर देख सकती हूँ?", en: "Can I try this on?" },
      { hi: "थोड़ा कम कर दीजिए।", en: "Could you give me a small discount?", note: "Bargaining phrases depend on the shop; this one is polite everywhere." },
    ],
    pattern: {
      title: "this / these, is / are",
      instruction: { en: "Choose the correct word.", hi: "सही शब्द चुनें।" },
      items: [
        { prompt: "How much ___ these shoes?", options: ["is", "are"], answer: "are", explain: "Shoes = plural → are." },
        { prompt: "Do you have this ___ blue?", options: ["in", "on", "at"], answer: "in", explain: "Colours and sizes: in blue, in medium." },
        { prompt: "Can I ___ this on?", options: ["try", "trying", "tried"], answer: "try", explain: "Can I + base verb: Can I try this on?" },
      ],
    },
    dialogue: {
      context: "In a clothing shop.",
      lines: [
        { speaker: "Ishita", en: "Excuse me, how much is this kurta?", hi: "माफ़ कीजिए, यह कुर्ता कितने का है?" },
        { speaker: "Seller", en: "It’s eight hundred rupees.", hi: "यह आठ सौ रुपये का है।" },
        { speaker: "Ishita", en: "Do you have it in green?", hi: "क्या यह हरे रंग में है?" },
        { speaker: "Seller", en: "Yes, here you are. Would you like to try it on?", hi: "हाँ, यह लीजिए। क्या आप पहनकर देखना चाहेंगी?" },
        { speaker: "Ishita", en: "Yes, please. Where is the trial room?", hi: "हाँ, ज़रूर। ट्रायल रूम कहाँ है?" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "यह कितने का है?", accepted: ["How much is this?", "What is the price of this?", "How much does this cost?"], feedback: "How much is this? — simple and common." },
      {
        kind: "mcq",
        prompt: "You don’t want to buy. What’s a polite reply?",
        options: ["No. Bad.", "I’ll think about it, thanks.", "Too costly, go."],
        answer: "I’ll think about it, thanks.",
        feedback: "Polite and friendly — the seller won’t feel bad.",
      },
      { kind: "translate", hi: "क्या मैं इसे पहनकर देख सकता हूँ?", accepted: ["Can I try this on?", "Could I try this on?", "Can I try it on?", "May I try this on?"], feedback: "“try on” = पहनकर देखना." },
    ],
    speaking: {
      prompt: { en: "Ask about price and one other option for a bag you like.", hi: "पसंद आए बैग का दाम और एक दूसरा विकल्प पूछें।" },
      sample: "How much is this bag? It’s nice. Do you have it in black?",
      tip: { en: "Point and say “this one” or “that one” — it keeps things simple.", hi: "इशारा करके “this one” या “that one” कहें।" },
    },
    recap: ["How much is this / are these?", "Do you have this in + size/colour?", "Can I try this on?", "I’ll think about it, thanks."],
  },
  {
    id: "every-3",
    title: "Asking for directions and help",
    titleHi: "रास्ता और मदद माँगना",
    minutes: 9,
    objective: { en: "Ask strangers for directions or help, and understand simple answers.", hi: "अनजान लोगों से रास्ता या मदद माँगें और आसान जवाब समझें।" },
    explanation: {
      en: "Start with “Excuse me”, then ask: “Could you tell me how to get to…?” or “Could you help me, please?”. Common answers use: go straight, turn left / right, next to, opposite.",
      hi: "“Excuse me” से शुरू करें, फिर पूछें: “Could you tell me how to get to…?” या “Could you help me, please?” जवाब में अक्सर आते हैं: go straight (सीधे जाइए), turn left / right (बाएँ / दाएँ मुड़िए), next to (बगल में), opposite (सामने)।",
    },
    examples: [
      { hi: "मेट्रो स्टेशन कैसे जाऊँ?", en: "How do I get to the metro station?", alt: "Could you tell me the way to the metro station?" },
      { hi: "क्या आप मेरी मदद कर सकते हैं?", en: "Could you help me, please?", alt: "Can you help me, please?" },
      { hi: "सीधे जाइए और फिर बाएँ मुड़िए।", en: "Go straight and then turn left." },
      { hi: "यह बैंक के सामने है।", en: "It’s opposite the bank.", note: "“opposite” = सामने। Don’t add “of”: opposite the bank." },
    ],
    pattern: {
      title: "Direction words",
      instruction: { en: "Choose the right word.", hi: "सही शब्द चुनें।" },
      items: [
        { prompt: "Turn ___ at the signal.", options: ["left", "lefts", "on left side"], answer: "left", explain: "Turn left / turn right." },
        { prompt: "The pharmacy is ___ to the school.", options: ["next", "near of", "beside of"], answer: "next", explain: "next to = बगल में." },
        { prompt: "___ straight for two minutes.", options: ["Go", "Going", "Goes"], answer: "Go", explain: "Instructions start with the base verb." },
      ],
    },
    dialogue: {
      context: "On a busy street.",
      lines: [
        { speaker: "Arjun", en: "Excuse me, could you help me? I’m looking for City Hospital.", hi: "माफ़ कीजिए, क्या आप मदद करेंगे? मैं सिटी हॉस्पिटल ढूँढ रहा हूँ।" },
        { speaker: "Woman", en: "Sure. Go straight and turn right at the signal.", hi: "ज़रूर। सीधे जाइए और सिग्नल पर दाएँ मुड़िए।" },
        { speaker: "Arjun", en: "Is it far from here?", hi: "क्या यह यहाँ से दूर है?" },
        { speaker: "Woman", en: "No, it’s about five minutes on foot. It’s opposite the park.", hi: "नहीं, पैदल लगभग पाँच मिनट। यह पार्क के सामने है।" },
        { speaker: "Arjun", en: "Thank you so much!", hi: "बहुत-बहुत धन्यवाद!" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "क्या आप मेरी मदद कर सकते हैं?", accepted: ["Could you help me?", "Can you help me?", "Could you help me, please?", "Can you help me, please?", "Could you please help me?"], feedback: "“Could you…?” is a little more polite than “Can you…?”." },
      { kind: "mcq", prompt: "“सामने” in English is…", options: ["opposite", "behind", "inside"], answer: "opposite", feedback: "opposite = सामने, behind = पीछे." },
      { kind: "translate", hi: "दाएँ मुड़िए।", accepted: ["Turn right.", "Take a right.", "Turn to the right."], feedback: "Turn right / take a right — both are fine." },
    ],
    speaking: {
      prompt: { en: "Ask someone the way to a railway station and check if it’s far.", hi: "किसी से रेलवे स्टेशन का रास्ता पूछें और पूछें कि दूर है या नहीं।" },
      sample: "Excuse me, how do I get to the railway station? Is it far from here?",
      tip: { en: "Repeat directions back: “So, straight and then right?” — it confirms you understood.", hi: "दिशा दोहराएँ: “So, straight and then right?” — इससे पक्का हो जाता है।" },
    },
    recap: ["Excuse me, could you help me?", "How do I get to…?", "go straight / turn left / turn right", "next to / opposite / near"],
  },

  /* ============ 3. Practical Grammar ============ */
  {
    id: "gram-1",
    title: "Talking about your daily routine",
    titleHi: "अपनी दिनचर्या के बारे में बताना",
    minutes: 10,
    objective: { en: "Use the simple present to describe habits and routines.", hi: "आदतों और रोज़ के कामों के लिए simple present का प्रयोग करें।" },
    explanation: {
      en: "For things you do regularly, use the simple present: I wake up, I go, I eat. With he / she / it, add -s or -es: she wakes up, he goes, it starts.",
      hi: "जो काम रोज़ या नियमित रूप से होते हैं, उनके लिए simple present लगाएँ: I wake up, I go. he / she / it के साथ क्रिया में -s या -es जोड़ें: she wakes up, he goes.",
    },
    examples: [
      { hi: "मैं छह बजे उठता हूँ।", en: "I wake up at six.", alt: "I get up at 6 a.m." },
      { hi: "वह बस से ऑफ़िस जाती है।", en: "She goes to the office by bus." },
      { hi: "हम रात को साथ खाना खाते हैं।", en: "We have dinner together.", note: "In English we usually say “have dinner”, not “eat dinner”." },
      { hi: "मेरा भाई रोज़ क्रिकेट खेलता है।", en: "My brother plays cricket every day." },
    ],
    pattern: {
      title: "Add -s for he / she / it",
      instruction: { en: "Choose the correct verb form.", hi: "क्रिया का सही रूप चुनें।" },
      items: [
        { prompt: "She ___ tea every morning.", options: ["drink", "drinks", "drinking"], answer: "drinks", explain: "She → drinks." },
        { prompt: "I ___ to work by metro.", options: ["go", "goes", "going"], answer: "go", explain: "I → go (no -s)." },
        { prompt: "My father ___ the newspaper.", options: ["read", "reads", "reading"], answer: "reads", explain: "My father = he → reads." },
      ],
    },
    dialogue: {
      context: "Colleagues talking during a break.",
      lines: [
        { speaker: "Meera", en: "What time do you usually start work?", hi: "तुम आमतौर पर काम कितने बजे शुरू करते हो?" },
        { speaker: "Vikram", en: "I start at nine. I take the metro.", hi: "मैं नौ बजे शुरू करता हूँ। मैं मेट्रो लेता हूँ।" },
        { speaker: "Meera", en: "My sister drives, but I prefer the bus.", hi: "मेरी बहन गाड़ी चलाती है, लेकिन मुझे बस पसंद है।" },
        { speaker: "Vikram", en: "The bus is relaxing. You can read on the way.", hi: "बस आरामदायक है। रास्ते में पढ़ सकते हैं।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "वह हर दिन योग करती है।", accepted: ["She does yoga every day.", "She practises yoga every day.", "She practices yoga every day.", "She does yoga daily."], feedback: "do → does with she." },
      { kind: "mcq", prompt: "Which is correct?", options: ["He go to college.", "He goes to college.", "He going to college."], answer: "He goes to college.", feedback: "go → goes with he / she / it." },
      { kind: "translate", hi: "मैं सात बजे नाश्ता करता हूँ।", accepted: ["I have breakfast at seven.", "I eat breakfast at seven.", "I have breakfast at 7.", "I have breakfast at seven o'clock.", "I eat breakfast at 7."], feedback: "“have breakfast” is the most natural." },
    ],
    speaking: {
      prompt: { en: "Describe your morning from waking up to leaving home.", hi: "उठने से लेकर घर से निकलने तक अपनी सुबह बताइए।" },
      sample: "I wake up at six thirty. I drink a glass of water and go for a short walk. Then I have breakfast and leave for college at eight.",
      tip: { en: "Use “then” and “after that” to connect your sentences.", hi: "वाक्य जोड़ने के लिए “then” और “after that” लगाएँ।" },
    },
    recap: ["Habits → simple present", "I / you / we / they + verb", "he / she / it + verb-s", "Connect with then, after that"],
  },
  {
    id: "gram-2",
    title: "Telling a story about yesterday",
    titleHi: "बीते कल की बात बताना",
    minutes: 10,
    objective: { en: "Use the simple past to talk about finished actions.", hi: "पूरे हो चुके कामों के लिए simple past का प्रयोग करें।" },
    explanation: {
      en: "For finished actions, use the past form: worked, visited, watched. Some common verbs are irregular: go → went, eat → ate, see → saw. In questions and negatives use did + base verb: Did you go? I didn’t go.",
      hi: "पूरे हो चुके कामों के लिए क्रिया का past रूप: worked, visited. कुछ आम क्रियाएँ अलग बदलती हैं: go → went, eat → ate, see → saw. सवाल और ‘नहीं’ वाले वाक्यों में did + मूल क्रिया: Did you go? I didn’t go.",
    },
    examples: [
      { hi: "मैं कल बाज़ार गया।", en: "I went to the market yesterday." },
      { hi: "हमने एक फ़िल्म देखी।", en: "We watched a movie.", alt: "We saw a film." },
      { hi: "मुझे यह समझ नहीं आया।", en: "I didn’t understand this.", alt: "I did not understand this." },
      { hi: "क्या तुमने खाना खाया?", en: "Did you eat?", alt: "Have you eaten?", note: "Indian English often uses “Did you have lunch?” — perfectly fine." },
    ],
    pattern: {
      title: "Past forms",
      instruction: { en: "Choose the past form.", hi: "past रूप चुनें।" },
      items: [
        { prompt: "Yesterday I ___ my grandmother.", options: ["visit", "visited", "visiting"], answer: "visited", explain: "Regular verb: visit → visited." },
        { prompt: "She ___ to Pune last week.", options: ["go", "goed", "went"], answer: "went", explain: "Irregular: go → went." },
        { prompt: "I didn’t ___ the message.", options: ["see", "saw", "seen"], answer: "see", explain: "After didn’t, use the base verb." },
      ],
    },
    dialogue: {
      context: "Friends on a Monday morning.",
      lines: [
        { speaker: "Tara", en: "What did you do on Sunday?", hi: "तुमने रविवार को क्या किया?" },
        { speaker: "Dev", en: "I visited my cousins. We played cards and ate biryani.", hi: "मैं अपने कज़िन्स से मिलने गया। हमने ताश खेला और बिरयानी खाई।" },
        { speaker: "Tara", en: "Nice! Did you watch the match?", hi: "बढ़िया! क्या तुमने मैच देखा?" },
        { speaker: "Dev", en: "No, I didn’t. I missed it!", hi: "नहीं, नहीं देखा। मुझसे छूट गया!" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मुझे यह समझ नहीं आया।", accepted: ["I didn't understand this.", "I did not understand this.", "I didn't understand it.", "I didn't get this.", "I did not understand it."], feedback: "didn’t + base verb (understand)." },
      { kind: "mcq", prompt: "Which is correct?", options: ["I didn’t went.", "I didn’t go.", "I not went."], answer: "I didn’t go.", feedback: "didn’t already shows the past, so the verb stays “go”." },
      { kind: "translate", hi: "हमने कल क्रिकेट खेला।", accepted: ["We played cricket yesterday.", "Yesterday we played cricket."], feedback: "play → played." },
    ],
    speaking: {
      prompt: { en: "Tell us three things you did last weekend.", hi: "पिछले वीकेंड आपने कौन-सी तीन चीज़ें कीं, बताइए।" },
      sample: "Last weekend I cleaned my room, I called my best friend, and I watched a cricket match with my dad.",
      tip: { en: "Past forms like “went” and “ate” come with practice — mistakes are part of learning.", hi: "“went”, “ate” जैसे रूप प्रैक्टिस से आते हैं — ग़लतियाँ सीखने का हिस्सा हैं।" },
    },
    recap: ["Regular: add -ed (worked)", "Irregular: go→went, eat→ate, see→saw", "Questions: Did + subject + base verb?", "Negative: didn’t + base verb"],
  },
  {
    id: "gram-3",
    title: "Future plans: will and going to",
    titleHi: "भविष्य की योजनाएँ: will और going to",
    minutes: 9,
    objective: { en: "Talk about plans and quick decisions with going to and will.", hi: "going to और will से योजनाओं और तुरंत लिए फ़ैसलों के बारे में बताएँ।" },
    explanation: {
      en: "Use “going to” for plans you have already made: “I’m going to visit Goa.” Use “will” for decisions you make now, offers and promises: “I’ll call you later.”",
      hi: "पहले से तय योजना के लिए “going to”: “I’m going to visit Goa.” अभी लिए फ़ैसले, मदद की पेशकश या वादे के लिए “will”: “I’ll call you later.”",
    },
    examples: [
      { hi: "मैं अगले साल MBA करने वाला हूँ।", en: "I’m going to do an MBA next year." },
      { hi: "मैं तुम्हें बाद में फ़ोन करूँगा।", en: "I’ll call you later.", alt: "I will call you later." },
      { hi: "मैं इंटरव्यू की तैयारी कर रहा हूँ।", en: "I am preparing for an interview.", note: "Present continuous (am + -ing) also shows current activities and near plans." },
      { hi: "चिंता मत करो, मैं मदद करूँगी।", en: "Don’t worry, I’ll help you." },
    ],
    pattern: {
      title: "Plan or quick decision?",
      instruction: { en: "Choose will or going to.", hi: "will या going to चुनें।" },
      items: [
        { prompt: "We’ve booked tickets. We’re ___ travel on Friday.", options: ["going to", "will"], answer: "going to", explain: "Already planned (tickets booked) → going to." },
        { prompt: "The phone is ringing. I ___ get it.", options: ["’ll", "am going to"], answer: "’ll", explain: "Decision right now → I’ll." },
        { prompt: "I promise I ___ be on time.", options: ["will", "am going to"], answer: "will", explain: "Promises → will." },
      ],
    },
    dialogue: {
      context: "Two classmates after exams.",
      lines: [
        { speaker: "Ankit", en: "What are you going to do this summer?", hi: "तुम इस गर्मी में क्या करने वाली हो?" },
        { speaker: "Sara", en: "I’m going to do an internship in Bengaluru.", hi: "मैं बेंगलुरु में इंटर्नशिप करने वाली हूँ।" },
        { speaker: "Ankit", en: "That’s great! I’ll send you some tips about the city.", hi: "बहुत बढ़िया! मैं तुम्हें शहर के बारे में कुछ टिप्स भेजूँगा।" },
        { speaker: "Sara", en: "Thanks, I’ll message you when I get there.", hi: "धन्यवाद, वहाँ पहुँचकर मैं तुम्हें मैसेज करूँगी।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं इंटरव्यू की तैयारी कर रहा हूँ।", accepted: ["I am preparing for an interview.", "I'm preparing for an interview.", "I am preparing for the interview.", "I'm preparing for my interview."], feedback: "am + preparing = happening now." },
      { kind: "mcq", prompt: "Your friend’s bag is heavy. You offer help:", options: ["I’ll carry it.", "I’m going to carry it next week.", "I carry it."], answer: "I’ll carry it.", feedback: "Offers made in the moment use will." },
      { kind: "translate", hi: "मैं तुम्हें बाद में फ़ोन करूँगा।", accepted: ["I'll call you later.", "I will call you later.", "I'll phone you later.", "I will phone you later."], feedback: "Promise/decision → will." },
    ],
    speaking: {
      prompt: { en: "Share one plan for next month and one promise to yourself.", hi: "अगले महीने की एक योजना और ख़ुद से एक वादा बताइए।" },
      sample: "Next month I’m going to join a gym. I promise I will practise English for ten minutes every day.",
      tip: { en: "Short forms (I’ll, I’m going to) sound natural in conversation.", hi: "बातचीत में I’ll, I’m going to स्वाभाविक लगते हैं।" },
    },
    recap: ["Plans already made → going to", "Instant decisions, offers, promises → will", "am / is / are + -ing → happening now"],
  },

  /* ============ 4. Vocabulary in Context ============ */
  {
    id: "vocab-1",
    title: "Feelings and emotions",
    titleHi: "भावनाएँ",
    minutes: 8,
    objective: { en: "Describe how you feel with precise words beyond “good” and “bad”.", hi: "“good” और “bad” से आगे, सही शब्दों से अपनी भावनाएँ बताएँ।" },
    explanation: {
      en: "English has many feeling words. Use “I feel…” or “I’m…” + the feeling: I’m nervous, I feel relaxed. Add “a bit” or “really” to change the strength.",
      hi: "अंग्रेज़ी में भावनाओं के कई शब्द हैं। “I feel…” या “I’m…” + भावना बोलें: I’m nervous, I feel relaxed. ताक़त बदलने के लिए “a bit” (थोड़ा) या “really” (बहुत) जोड़ें।",
    },
    examples: [
      { hi: "मैं थोड़ा घबराया हुआ हूँ।", en: "I’m a bit nervous." },
      { hi: "मुझे गर्व है।", en: "I’m proud.", alt: "I feel proud." },
      { hi: "मैं बहुत उत्साहित हूँ।", en: "I’m really excited." },
      { hi: "वह परेशान लग रहा है।", en: "He looks worried.", note: "“looks” = लग रहा है (from what we see)." },
    ],
    pattern: {
      title: "Match the feeling",
      instruction: { en: "Choose the best word for the situation.", hi: "स्थिति के लिए सबसे सही शब्द चुनें।" },
      items: [
        { prompt: "Before an exam I feel ___.", options: ["nervous", "bored", "proud"], answer: "nervous", explain: "nervous = घबराया हुआ." },
        { prompt: "After a long day, I’m ___.", options: ["exhausted", "excited", "curious"], answer: "exhausted", explain: "exhausted = बहुत थका हुआ." },
        { prompt: "My sister got the job. I’m so ___ of her!", options: ["proud", "angry", "scared"], answer: "proud", explain: "proud of someone = किसी पर गर्व." },
      ],
    },
    dialogue: {
      context: "A friend calls after an interview.",
      lines: [
        { speaker: "Nikhil", en: "How was the interview? Are you okay?", hi: "इंटरव्यू कैसा रहा? तुम ठीक हो?" },
        { speaker: "Aisha", en: "I was nervous at first, but then I felt confident.", hi: "पहले मैं घबराई हुई थी, लेकिन फिर आत्मविश्वास आ गया।" },
        { speaker: "Nikhil", en: "I’m really proud of you!", hi: "मुझे तुम पर सच में गर्व है!" },
        { speaker: "Aisha", en: "Thanks. Now I’m just exhausted!", hi: "धन्यवाद। अब बस बहुत थक गई हूँ!" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं बहुत उत्साहित हूँ।", accepted: ["I'm really excited.", "I am really excited.", "I'm very excited.", "I am very excited.", "I'm so excited."], feedback: "really / very / so all add strength." },
      { kind: "mcq", prompt: "“बोर होना” is…", options: ["bored", "boring", "board"], answer: "bored", feedback: "I’m bored = मैं बोर हो रहा हूँ. “boring” describes the thing: The film is boring." },
      { kind: "translate", hi: "मुझे तुम पर गर्व है।", accepted: ["I'm proud of you.", "I am proud of you."], feedback: "proud of + person." },
    ],
    speaking: {
      prompt: { en: "How do you feel today, and why? Use two feeling words.", hi: "आज आप कैसा महसूस कर रहे हैं और क्यों? दो भावना-शब्द लगाएँ।" },
      sample: "Today I feel a bit tired because I slept late, but I’m excited about my weekend trip.",
      tip: { en: "Give a reason with “because” — it makes your answer longer and clearer.", hi: "“because” से कारण बताएँ — जवाब लंबा और साफ़ हो जाता है।" },
    },
    recap: ["I feel / I’m + feeling", "a bit (थोड़ा), really (बहुत)", "bored (person) vs boring (thing)", "proud of + person"],
  },
  {
    id: "vocab-2",
    title: "Home and family",
    titleHi: "घर और परिवार",
    minutes: 8,
    objective: { en: "Talk about your family members and your home.", hi: "अपने परिवार और घर के बारे में बात करें।" },
    explanation: {
      en: "Use “I live with…” to say who you live with, and “There is / There are” to describe your home. English doesn’t separate चाचा, मामा, ताऊ — all are “uncle”. You can add detail: “my father’s younger brother”.",
      hi: "किसके साथ रहते हैं बताने के लिए “I live with…”, और घर के बारे में बताने के लिए “There is / There are” लगाएँ। अंग्रेज़ी में चाचा, मामा, ताऊ — सब “uncle” हैं। ज़रूरत हो तो बताएँ: “my father’s younger brother”.",
    },
    examples: [
      { hi: "मैं अपने माता-पिता के साथ रहता हूँ।", en: "I live with my parents." },
      { hi: "हमारे घर में तीन कमरे हैं।", en: "There are three rooms in our house.", alt: "Our house has three rooms." },
      { hi: "मेरे मामा मुंबई में रहते हैं।", en: "My uncle lives in Mumbai.", note: "Add “on my mother’s side” if you want to be specific." },
      { hi: "मेरी एक छोटी बहन है।", en: "I have a younger sister.", alt: "I have a little sister." },
    ],
    pattern: {
      title: "There is / There are",
      instruction: { en: "Choose the correct option.", hi: "सही विकल्प चुनें।" },
      items: [
        { prompt: "There ___ a small balcony.", options: ["is", "are"], answer: "is", explain: "One balcony → There is." },
        { prompt: "There ___ two bedrooms.", options: ["is", "are"], answer: "are", explain: "Two bedrooms → There are." },
        { prompt: "I live ___ my grandparents.", options: ["with", "by", "for"], answer: "with", explain: "live with = के साथ रहना." },
      ],
    },
    dialogue: {
      context: "New neighbours chatting.",
      lines: [
        { speaker: "Kavya", en: "Do you live alone?", hi: "क्या आप अकेले रहते हैं?" },
        { speaker: "Rohan", en: "No, I live with my wife and my mother.", hi: "नहीं, मैं अपनी पत्नी और माँ के साथ रहता हूँ।" },
        { speaker: "Kavya", en: "How many rooms are there in your flat?", hi: "आपके फ़्लैट में कितने कमरे हैं?" },
        { speaker: "Rohan", en: "There are two bedrooms and a big kitchen.", hi: "दो बेडरूम और एक बड़ी रसोई है।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं अपने माता-पिता के साथ रहता हूँ।", accepted: ["I live with my parents.", "I stay with my parents."], feedback: "“stay with” is common in Indian English too." },
      { kind: "mcq", prompt: "“भाभी” in English is usually…", options: ["sister-in-law", "aunt", "cousin"], answer: "sister-in-law", feedback: "Brother’s wife = sister-in-law." },
      { kind: "translate", hi: "मेरी एक छोटी बहन है।", accepted: ["I have a younger sister.", "I have a little sister.", "I have one younger sister.", "I have a small sister."], feedback: "“younger sister” is the clearest; “small sister” is understood but less natural." },
    ],
    speaking: {
      prompt: { en: "Describe who lives in your home and one favourite place in it.", hi: "बताइए आपके घर में कौन रहता है और घर की कोई पसंदीदा जगह।" },
      sample: "I live with my parents and my younger brother. My favourite place is our balcony because there are lots of plants.",
      tip: { en: "Don’t worry about exact relation names — explain it simply.", hi: "रिश्तों के सही नाम की चिंता न करें — आसान तरीक़े से समझाएँ।" },
    },
    recap: ["I live with…", "There is (one) / There are (many)", "uncle, aunt, cousin cover many Hindi relations", "younger / elder sister & brother"],
  },
  {
    id: "vocab-3",
    title: "Time and frequency words",
    titleHi: "समय और आवृत्ति के शब्द",
    minutes: 8,
    objective: { en: "Say how often you do things using always, usually, sometimes and never.", hi: "always, usually, sometimes, never से बताएँ कि आप कोई काम कितनी बार करते हैं।" },
    explanation: {
      en: "Frequency words usually go before the main verb (I always walk) but after am / is / are (I am always late). From most to least: always → usually → often → sometimes → rarely → never.",
      hi: "ये शब्द आम तौर पर मुख्य क्रिया से पहले आते हैं (I always walk), पर am / is / are के बाद (I am always late)। ज़्यादा से कम: always (हमेशा) → usually (आमतौर पर) → often (अक्सर) → sometimes (कभी-कभी) → rarely (शायद ही कभी) → never (कभी नहीं)।",
    },
    examples: [
      { hi: "मैं हमेशा नाश्ता करता हूँ।", en: "I always have breakfast." },
      { hi: "वह कभी-कभी देर से आती है।", en: "She sometimes comes late.", alt: "Sometimes she comes late." },
      { hi: "मैं कभी झूठ नहीं बोलता।", en: "I never lie.", note: "“never” already means ‘not’, so don’t add “don’t”." },
      { hi: "हम आमतौर पर रविवार को फ़िल्म देखते हैं।", en: "We usually watch a movie on Sundays." },
    ],
    pattern: {
      title: "Where does it go?",
      instruction: { en: "Choose the correct sentence.", hi: "सही वाक्य चुनें।" },
      items: [
        { prompt: "Choose the correct one:", options: ["I go always to gym.", "I always go to the gym."], answer: "I always go to the gym.", explain: "Before the main verb: always go." },
        { prompt: "Choose the correct one:", options: ["He is never late.", "He never is late."], answer: "He is never late.", explain: "After is: is never late." },
        { prompt: "Choose the correct one:", options: ["I don’t never eat meat.", "I never eat meat."], answer: "I never eat meat.", explain: "never = not; no extra don’t." },
      ],
    },
    dialogue: {
      context: "Roommates planning the week.",
      lines: [
        { speaker: "Harsh", en: "Do you cook every day?", hi: "क्या तुम रोज़ खाना बनाते हो?" },
        { speaker: "Ali", en: "Usually, yes. But on Fridays I sometimes order food.", hi: "आमतौर पर हाँ। लेकिन शुक्रवार को कभी-कभी खाना मँगा लेता हूँ।" },
        { speaker: "Harsh", en: "I never cook. I’m always too tired!", hi: "मैं कभी खाना नहीं बनाता। मैं हमेशा बहुत थका होता हूँ!" },
        { speaker: "Ali", en: "Let’s cook together on Sunday, then.", hi: "तो चलो रविवार को साथ में बनाते हैं।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं हमेशा नाश्ता करता हूँ।", accepted: ["I always have breakfast.", "I always eat breakfast."], feedback: "always before the verb." },
      { kind: "mcq", prompt: "“अक्सर” in English is…", options: ["often", "never", "rarely"], answer: "often", feedback: "often = अक्सर." },
      { kind: "translate", hi: "वह कभी-कभी देर से आती है।", accepted: ["She sometimes comes late.", "Sometimes she comes late.", "She is sometimes late.", "She comes late sometimes."], feedback: "“sometimes” can move around the sentence." },
    ],
    speaking: {
      prompt: { en: "Tell us one thing you always do, one you sometimes do and one you never do.", hi: "एक काम जो आप हमेशा करते हैं, एक जो कभी-कभी, और एक जो कभी नहीं करते।" },
      sample: "I always drink tea in the morning. I sometimes go running. I never skip my English practice!",
      tip: { en: "Exaggerate for fun — it makes practice memorable.", hi: "मज़े के लिए थोड़ा बढ़ा-चढ़ाकर बोलें — याद रहता है।" },
    },
    recap: ["always → usually → often → sometimes → rarely → never", "Before the main verb", "After am / is / are", "never = not (no extra don’t)"],
  },

  /* ============ 5. Workplace and Interview English ============ */
  {
    id: "work-1",
    title: "Tell me about yourself",
    titleHi: "अपने बारे में बताइए",
    minutes: 12,
    objective: { en: "Answer “Tell me about yourself” in a clear present → past → future structure.", hi: "“Tell me about yourself” का जवाब वर्तमान → अतीत → भविष्य के क्रम में दें।" },
    explanation: {
      en: "Interviewers want a short, focused answer (about 60 seconds), not your life story. A simple structure: Present (what you do now) → Past (relevant experience or study) → Future (why this role).",
      hi: "इंटरव्यू लेने वाले को छोटा और सटीक जवाब (लगभग 60 सेकंड) चाहिए, पूरी जीवन-कहानी नहीं। आसान ढाँचा: Present (अभी क्या करते हैं) → Past (संबंधित अनुभव या पढ़ाई) → Future (यह नौकरी क्यों)।",
    },
    examples: [
      { hi: "मैं अभी एक सॉफ़्टवेयर कंपनी में सपोर्ट एग्ज़िक्यूटिव हूँ।", en: "I currently work as a support executive at a software company." },
      { hi: "मैंने कॉमर्स में ग्रेजुएशन किया है।", en: "I have a bachelor’s degree in commerce.", alt: "I graduated in commerce." },
      { hi: "मुझे ग्राहकों की समस्याएँ सुलझाना अच्छा लगता है।", en: "I enjoy solving customer problems." },
      { hi: "मैं ऐसी भूमिका ढूँढ रही हूँ जहाँ मैं और सीख सकूँ।", en: "I’m looking for a role where I can keep learning.", note: "Connect your future to the company’s role." },
    ],
    pattern: {
      title: "Professional phrases",
      instruction: { en: "Choose the most professional option.", hi: "सबसे प्रोफ़ेशनल विकल्प चुनें।" },
      items: [
        { prompt: "I ___ as a sales associate for two years.", options: ["have worked", "am working since", "did working"], answer: "have worked", explain: "have worked = experience up to now." },
        { prompt: "I’m ___ in data analysis.", options: ["interested", "interesting", "interest"], answer: "interested", explain: "interested in = रुचि है." },
        { prompt: "I’m good ___ working in a team.", options: ["at", "in", "for"], answer: "at", explain: "good at + -ing." },
      ],
    },
    dialogue: {
      context: "A job interview.",
      lines: [
        { speaker: "Interviewer", en: "So, tell me about yourself.", hi: "तो, अपने बारे में बताइए।" },
        { speaker: "Rakesh", en: "Sure. I’m currently a customer support executive at a telecom company.", hi: "ज़रूर। मैं अभी एक टेलीकॉम कंपनी में कस्टमर सपोर्ट एग्ज़िक्यूटिव हूँ।" },
        { speaker: "Rakesh", en: "Before that, I completed my B.Com from Kanpur University.", hi: "उससे पहले मैंने कानपुर यूनिवर्सिटी से बी.कॉम पूरा किया।" },
        { speaker: "Rakesh", en: "Now I’m looking for a team lead role where I can use my communication skills.", hi: "अब मैं टीम लीड की भूमिका ढूँढ रहा हूँ जहाँ मैं अपनी कम्युनिकेशन स्किल्स का इस्तेमाल कर सकूँ।" },
        { speaker: "Interviewer", en: "That’s a clear summary. Thank you.", hi: "यह साफ़ सारांश है। धन्यवाद।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं इंटरव्यू की तैयारी कर रहा हूँ।", accepted: ["I am preparing for an interview.", "I'm preparing for an interview.", "I'm preparing for my interview.", "I am preparing for the interview."], feedback: "am preparing = right now, in progress." },
      {
        kind: "mcq",
        prompt: "What’s the best first sentence for “Tell me about yourself”?",
        options: ["I was born in 1999 in a small village…", "I’m currently a junior accountant with two years of experience.", "I don’t know what to say."],
        answer: "I’m currently a junior accountant with two years of experience.",
        feedback: "Start with your present role — it’s most relevant.",
      },
      { kind: "translate", hi: "मुझे टीम में काम करना पसंद है।", accepted: ["I like working in a team.", "I enjoy working in a team.", "I like to work in a team.", "I love working in a team.", "I enjoy working in teams."], feedback: "like / enjoy + -ing." },
    ],
    speaking: {
      prompt: { en: "Answer “Tell me about yourself” in about 45–60 seconds using present → past → future.", hi: "Present → Past → Future क्रम में लगभग 45–60 सेकंड में “Tell me about yourself” का जवाब दें।" },
      sample: "I’m currently a final-year B.Sc. student in Nagpur. Last summer I did an internship in a pharma lab, where I learned quality testing. Now I’m looking for a role in quality control where I can grow.",
      tip: { en: "Practise it aloud a few times, but don’t memorise every word — keep it natural.", hi: "कुछ बार बोलकर प्रैक्टिस करें, पर हर शब्द रटें नहीं — स्वाभाविक रखें।" },
    },
    recap: ["Keep it to about one minute", "Present → Past → Future", "I currently work as… / I have worked…", "Link your future to the role"],
  },
  {
    id: "work-2",
    title: "Polite requests at work",
    titleHi: "ऑफ़िस में विनम्र अनुरोध",
    minutes: 10,
    objective: { en: "Ask colleagues and managers for things politely in speech and short emails.", hi: "सहकर्मियों और मैनेजर से बोलकर और छोटे ईमेल में विनम्रता से कुछ माँगें।" },
    explanation: {
      en: "Softeners make requests polite: “Could you…?”, “Would you mind + -ing…?”, “I was wondering if…”. Avoid “Do the needful” and “Revert back” in global emails — say “Please let me know” or “Please reply”.",
      hi: "कुछ शब्द अनुरोध को नरम बनाते हैं: “Could you…?”, “Would you mind + -ing…?”, “I was wondering if…”. अंतरराष्ट्रीय ईमेल में “Do the needful” और “Revert back” की जगह “Please let me know” या “Please reply” लिखें।",
    },
    examples: [
      { hi: "क्या आप यह रिपोर्ट चेक कर सकते हैं?", en: "Could you please check this report?" },
      { hi: "क्या आप थोड़ा धीरे बोल सकते हैं?", en: "Could you speak a little more slowly?", alt: "Could you slow down a little, please?" },
      { hi: "क्या मैं कल छुट्टी ले सकता हूँ?", en: "Would it be okay if I took tomorrow off?", alt: "Could I take leave tomorrow?" },
      { hi: "कृपया मुझे बताइए।", en: "Please let me know.", note: "Use this instead of “Please revert”." },
    ],
    pattern: {
      title: "Softer requests",
      instruction: { en: "Choose the more polite option.", hi: "ज़्यादा विनम्र विकल्प चुनें।" },
      items: [
        { prompt: "Would you mind ___ the file?", options: ["sending", "to send", "send"], answer: "sending", explain: "Would you mind + -ing." },
        { prompt: "I was ___ if you could help me.", options: ["wondering", "wonder", "wondered"], answer: "wondering", explain: "I was wondering if… = very polite." },
        { prompt: "Please ___ me know by Friday.", options: ["let", "make", "do"], answer: "let", explain: "let me know = मुझे बताइए." },
      ],
    },
    dialogue: {
      context: "Asking a manager for help.",
      lines: [
        { speaker: "Sneha", en: "Hi Mr. Rao, do you have a minute?", hi: "नमस्ते राव सर, क्या आपके पास एक मिनट है?" },
        { speaker: "Manager", en: "Sure, what’s up?", hi: "हाँ, बताइए?" },
        { speaker: "Sneha", en: "I was wondering if you could review my presentation before Friday.", hi: "क्या आप शुक्रवार से पहले मेरी प्रेज़ेंटेशन देख सकेंगे?" },
        { speaker: "Manager", en: "Of course. Please send it to me today.", hi: "ज़रूर। आज ही मुझे भेज दीजिए।" },
        { speaker: "Sneha", en: "Thank you, I really appreciate it.", hi: "धन्यवाद, मैं इसकी सच में सराहना करती हूँ।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "क्या आप थोड़ा धीरे बोल सकते हैं?", accepted: ["Could you speak a little more slowly?", "Could you speak a little slowly?", "Can you speak a little more slowly?", "Could you speak more slowly?", "Can you speak slowly?", "Could you please speak slowly?", "Could you slow down a little?"], feedback: "“a little more slowly” is the most natural." },
      { kind: "mcq", prompt: "Which email line is clearest internationally?", options: ["Kindly do the needful.", "Please revert back.", "Please let me know if you have any questions."], answer: "Please let me know if you have any questions.", feedback: "Clear and friendly for any reader." },
      { kind: "translate", hi: "कृपया यह फ़ाइल भेज दीजिए।", accepted: ["Please send this file.", "Could you please send this file?", "Please send me this file.", "Could you send the file, please?", "Please send the file."], feedback: "Please / Could you… both work." },
    ],
    speaking: {
      prompt: { en: "Politely ask a colleague to share meeting notes by evening.", hi: "विनम्रता से एक सहकर्मी से शाम तक मीटिंग नोट्स शेयर करने को कहें।" },
      sample: "Hi Priya, would you mind sharing the meeting notes by this evening? Thanks a lot!",
      tip: { en: "Say thank you in advance — “Thanks a lot!” closes requests warmly.", hi: "पहले ही धन्यवाद कहें — “Thanks a lot!”" },
    },
    recap: ["Could you…? / Would you mind + -ing?", "I was wondering if…", "Please let me know (not “revert back”)", "Thank you, I appreciate it."],
  },
  {
    id: "work-3",
    title: "Phone calls at work",
    titleHi: "ऑफ़िस में फ़ोन कॉल",
    minutes: 9,
    objective: { en: "Open, manage and close a professional phone call.", hi: "प्रोफ़ेशनल फ़ोन कॉल शुरू करें, संभालें और ख़त्म करें।" },
    explanation: {
      en: "Open with your name and company: “Hi, this is Arjun from Nova Tech.” Ask for someone: “Could I speak to…?” If the line is bad: “Sorry, you’re breaking up.” Close with: “Thanks for your time. Have a good day.”",
      hi: "शुरुआत में नाम और कंपनी बताएँ: “Hi, this is Arjun from Nova Tech.” किसी से बात करनी हो: “Could I speak to…?” आवाज़ कट रही हो: “Sorry, you’re breaking up.” अंत में: “Thanks for your time. Have a good day.”",
    },
    examples: [
      { hi: "नमस्ते, मैं ब्राइट सॉल्यूशंस से अनीता बोल रही हूँ।", en: "Hello, this is Anita from Bright Solutions.", note: "On the phone, say “This is…”, not “I am…”." },
      { hi: "क्या मैं श्री वर्मा से बात कर सकता हूँ?", en: "Could I speak to Mr. Verma, please?" },
      { hi: "आपकी आवाज़ कट रही है।", en: "Sorry, you’re breaking up.", alt: "Sorry, the line isn’t clear." },
      { hi: "मैं आपको दस मिनट में वापस कॉल करूँगा।", en: "I’ll call you back in ten minutes." },
    ],
    pattern: {
      title: "Phone phrases",
      instruction: { en: "Complete the phone phrase.", hi: "फ़ोन वाक्य पूरा करें।" },
      items: [
        { prompt: "Hi, ___ is Kunal from Apex Bank.", options: ["this", "I", "here"], answer: "this", explain: "On calls: “This is + name”." },
        { prompt: "Could I ___ a message?", options: ["leave", "left", "give back"], answer: "leave", explain: "leave a message = संदेश छोड़ना." },
        { prompt: "I’ll call you ___.", options: ["back", "again back", "return"], answer: "back", explain: "call back = वापस कॉल करना." },
      ],
    },
    dialogue: {
      context: "Calling a vendor.",
      lines: [
        { speaker: "Receptionist", en: "Good morning, Sunrise Traders. How can I help you?", hi: "सुप्रभात, सनराइज़ ट्रेडर्स। मैं आपकी क्या मदद कर सकती हूँ?" },
        { speaker: "Farhan", en: "Hi, this is Farhan from Metro Retail. Could I speak to Ms. Kapoor?", hi: "नमस्ते, मैं मेट्रो रिटेल से फ़रहान बोल रहा हूँ। क्या मैं सुश्री कपूर से बात कर सकता हूँ?" },
        { speaker: "Receptionist", en: "I’m afraid she’s in a meeting. Would you like to leave a message?", hi: "माफ़ कीजिए, वे मीटिंग में हैं। क्या आप संदेश छोड़ना चाहेंगे?" },
        { speaker: "Farhan", en: "Yes, please ask her to call me back about the order.", hi: "हाँ, कृपया उनसे कहिए कि ऑर्डर के बारे में मुझे वापस कॉल करें।" },
        { speaker: "Receptionist", en: "Sure. I’ll pass it on.", hi: "ज़रूर। मैं बता दूँगी।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मैं आपको वापस कॉल करूँगा।", accepted: ["I'll call you back.", "I will call you back.", "I'll call you back later.", "I will call you back later."], feedback: "call back = वापस कॉल करना." },
      { kind: "mcq", prompt: "How do you start a work call?", options: ["Hello, I am Neha speaking from…", "Hi, this is Neha from Zenith Labs.", "Who is this?"], answer: "Hi, this is Neha from Zenith Labs.", feedback: "“This is + name + from + company” is standard." },
      { kind: "translate", hi: "क्या मैं संदेश छोड़ सकता हूँ?", accepted: ["Can I leave a message?", "Could I leave a message?", "May I leave a message?"], feedback: "leave a message." },
    ],
    speaking: {
      prompt: { en: "Call a company, introduce yourself and ask for the HR manager.", hi: "किसी कंपनी को कॉल करें, अपना परिचय दें और HR मैनेजर से बात करने को कहें।" },
      sample: "Good afternoon, this is Ritu Sharma. I applied for the accounts position. Could I speak to the HR manager, please?",
      tip: { en: "Smile while you speak — people can hear it in your voice.", hi: "बोलते समय मुस्कुराइए — आवाज़ में सुनाई देता है।" },
    },
    recap: ["This is + name + from + company", "Could I speak to…?", "leave a message / call back", "Thanks for your time."],
  },

  /* ============ 6. Speaking Confidence ============ */
  {
    id: "speak-1",
    title: "Buying time while you think",
    titleHi: "सोचने का समय लेना",
    minutes: 7,
    objective: { en: "Use thinking phrases so you don’t freeze in conversations.", hi: "बातचीत में अटकने से बचने के लिए ‘सोचने वाले वाक्य’ इस्तेमाल करें।" },
    explanation: {
      en: "Even fluent speakers pause to think. Instead of silence or “umm…”, use phrases like “That’s a good question”, “Let me think for a second” or “How can I put it?”. They sound natural and give you time.",
      hi: "धाराप्रवाह बोलने वाले भी सोचने के लिए रुकते हैं। चुप रहने या “umm…” की जगह बोलें: “That’s a good question”, “Let me think for a second”, “How can I put it?” ये स्वाभाविक लगते हैं और आपको समय देते हैं।",
    },
    examples: [
      { hi: "अच्छा सवाल है।", en: "That’s a good question." },
      { hi: "मुझे एक सेकंड सोचने दीजिए।", en: "Let me think for a second.", alt: "Give me a moment to think." },
      { hi: "मैं इसे कैसे कहूँ…", en: "How can I put it…", alt: "How should I say this…" },
      { hi: "मुझे पूरा यक़ीन नहीं है, लेकिन…", en: "I’m not completely sure, but…" },
    ],
    pattern: {
      title: "Pick a thinking phrase",
      instruction: { en: "Choose the phrase that fits.", hi: "सही वाक्य चुनें।" },
      items: [
        { prompt: "Interviewer: What’s your biggest weakness? You: “___ I think…”", options: ["That’s a good question.", "Wrong question.", "No."], answer: "That’s a good question.", explain: "Polite and buys time." },
        { prompt: "You forget a word: “It’s a… ___”", options: ["how can I put it…", "stop.", "I’m going."], answer: "how can I put it…", explain: "Shows you’re searching for the right word." },
        { prompt: "Someone asks a date you don’t remember:", options: ["I’m not completely sure, but…", "I am never sure.", "Ask someone."], answer: "I’m not completely sure, but…", explain: "Honest and keeps the conversation going." },
      ],
    },
    dialogue: {
      context: "A casual chat at a meetup.",
      lines: [
        { speaker: "Lina", en: "What do you like most about your city?", hi: "तुम्हें अपने शहर में सबसे ज़्यादा क्या पसंद है?" },
        { speaker: "Varun", en: "Hmm, that’s a good question. Let me think for a second…", hi: "हम्म, अच्छा सवाल है। मुझे एक सेकंड सोचने दो…" },
        { speaker: "Varun", en: "I’d say the food. The street food is amazing.", hi: "मैं कहूँगा खाना। वहाँ का स्ट्रीट फ़ूड कमाल का है।" },
        { speaker: "Lina", en: "That sounds delicious!", hi: "सुनकर ही स्वादिष्ट लग रहा है!" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मुझे एक सेकंड सोचने दीजिए।", accepted: ["Let me think for a second.", "Let me think for a moment.", "Give me a second to think.", "Give me a moment to think.", "Let me think a second."], feedback: "Let me think… is the most common." },
      { kind: "mcq", prompt: "Which is a natural thinking phrase?", options: ["Let me see…", "I am thinking now please wait.", "Silence."], answer: "Let me see…", feedback: "Short and natural." },
      { kind: "translate", hi: "अच्छा सवाल है।", accepted: ["That's a good question.", "Good question.", "That is a good question.", "It's a good question."], feedback: "That’s a good question." },
    ],
    speaking: {
      prompt: { en: "Answer: “What would you do with a free day?” Start with a thinking phrase.", hi: "जवाब दें: “What would you do with a free day?” शुरुआत किसी सोचने वाले वाक्य से करें।" },
      sample: "Hmm, let me think… I’d probably sleep late, then meet my friends for chai and watch a movie in the evening.",
      tip: { en: "Pausing is normal. A calm pause sounds more confident than rushing.", hi: "रुकना सामान्य है। शांत ठहराव जल्दबाज़ी से ज़्यादा आत्मविश्वासी लगता है।" },
    },
    recap: ["That’s a good question.", "Let me think for a second.", "How can I put it…", "I’m not completely sure, but…"],
  },
  {
    id: "speak-2",
    title: "Asking for repetition and clarification",
    titleHi: "दोबारा पूछना और स्पष्टता माँगना",
    minutes: 7,
    objective: { en: "Politely ask people to repeat, slow down or explain.", hi: "विनम्रता से दोहराने, धीरे बोलने या समझाने को कहें।" },
    explanation: {
      en: "Not understanding is normal — even for native speakers. Use: “Sorry, could you repeat that?”, “Could you speak a little more slowly?”, “What do you mean by…?”. Asking shows you’re listening carefully.",
      hi: "कुछ समझ न आना सामान्य है — मूल वक्ताओं के साथ भी होता है। बोलें: “Sorry, could you repeat that?”, “Could you speak a little more slowly?”, “What do you mean by…?” पूछने से पता चलता है कि आप ध्यान से सुन रहे हैं।",
    },
    examples: [
      { hi: "माफ़ कीजिए, क्या आप फिर से बोल सकते हैं?", en: "Sorry, could you say that again?", alt: "Sorry, could you repeat that?" },
      { hi: "क्या आप थोड़ा धीरे बोल सकते हैं?", en: "Could you speak a little more slowly?" },
      { hi: "मुझे यह समझ नहीं आया।", en: "I didn’t understand this.", alt: "I didn’t quite catch that." },
      { hi: "“deadline” से आपका क्या मतलब है?", en: "What do you mean by “deadline”?" },
    ],
    pattern: {
      title: "Clarification phrases",
      instruction: { en: "Complete the phrase.", hi: "वाक्य पूरा करें।" },
      items: [
        { prompt: "Sorry, I didn’t ___ that.", options: ["catch", "hold", "take"], answer: "catch", explain: "catch = सुन/समझ पाना (in this phrase)." },
        { prompt: "What do you ___ by “ASAP”?", options: ["mean", "say", "tell"], answer: "mean", explain: "What do you mean by…?" },
        { prompt: "Could you ___ that again?", options: ["say", "tell", "speak"], answer: "say", explain: "say that again." },
      ],
    },
    dialogue: {
      context: "A customer call.",
      lines: [
        { speaker: "Agent", en: "Your ticket number is PX-4471-B.", hi: "आपका टिकट नंबर PX-4471-B है।" },
        { speaker: "Kiran", en: "Sorry, could you repeat that a little more slowly?", hi: "माफ़ कीजिए, क्या आप उसे थोड़ा धीरे दोहरा सकते हैं?" },
        { speaker: "Agent", en: "Of course. P, X, four, four, seven, one, B.", hi: "ज़रूर। P, X, चार, चार, सात, एक, B।" },
        { speaker: "Kiran", en: "Got it, thank you!", hi: "समझ गया, धन्यवाद!" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मुझे यह समझ नहीं आया।", accepted: ["I didn't understand this.", "I did not understand this.", "I didn't understand that.", "I didn't understand it.", "I didn't get that.", "I didn't quite catch that."], feedback: "Many versions are correct." },
      { kind: "mcq", prompt: "Which is the most polite?", options: ["What? Again!", "Sorry, could you repeat that?", "Say again fast."], answer: "Sorry, could you repeat that?", feedback: "Sorry + could you… = polite." },
      { kind: "translate", hi: "क्या आप थोड़ा धीरे बोल सकते हैं?", accepted: ["Could you speak a little more slowly?", "Could you speak a little slowly?", "Can you speak a little more slowly?", "Could you speak more slowly?", "Can you speak slowly?", "Could you please speak slowly?", "Could you speak slowly, please?"], feedback: "“a little more slowly” is the most natural." },
    ],
    speaking: {
      prompt: { en: "Your manager speaks too fast in a meeting. Politely ask them to slow down and explain one word.", hi: "मीटिंग में मैनेजर बहुत तेज़ बोल रहे हैं। विनम्रता से धीरे बोलने और एक शब्द समझाने को कहें।" },
      sample: "Sorry, could you speak a little more slowly? And what do you mean by “quarterly target”?",
      tip: { en: "Asking for clarity is a professional skill, not a weakness.", hi: "स्पष्टता माँगना कमज़ोरी नहीं, प्रोफ़ेशनल हुनर है।" },
    },
    recap: ["Sorry, could you repeat that?", "Could you speak a little more slowly?", "I didn’t quite catch that.", "What do you mean by…?"],
  },
  {
    id: "speak-3",
    title: "Giving your opinion",
    titleHi: "अपनी राय देना",
    minutes: 9,
    objective: { en: "Share an opinion, give a reason and an example.", hi: "राय दें, कारण बताएँ और एक उदाहरण दें।" },
    explanation: {
      en: "A strong opinion has three parts: Opinion (“I think…”) → Reason (“because…”) → Example (“For example…”). To disagree politely: “I see your point, but…”.",
      hi: "अच्छी राय के तीन हिस्से: Opinion (“I think…”) → Reason (“because…”) → Example (“For example…”)। विनम्रता से असहमत होने के लिए: “I see your point, but…”",
    },
    examples: [
      { hi: "मुझे लगता है कि ऑनलाइन पढ़ाई सुविधाजनक है।", en: "I think online classes are convenient." },
      { hi: "क्योंकि हम घर से पढ़ सकते हैं।", en: "Because we can study from home." },
      { hi: "मैं आपकी बात समझता हूँ, लेकिन…", en: "I see your point, but…", alt: "That’s true, but…" },
      { hi: "मेरी राय में, सुबह पढ़ना बेहतर है।", en: "In my opinion, studying in the morning is better." },
    ],
    pattern: {
      title: "Opinion → Reason → Example",
      instruction: { en: "Choose the best connector.", hi: "सबसे सही जोड़ने वाला शब्द चुनें।" },
      items: [
        { prompt: "I prefer trains ___ they are cheaper.", options: ["because", "but", "so that"], answer: "because", explain: "because gives a reason." },
        { prompt: "___ example, last month I saved ₹500.", options: ["For", "By", "In"], answer: "For", explain: "For example…" },
        { prompt: "I see your point, ___ I disagree.", options: ["but", "because", "and so"], answer: "but", explain: "but shows contrast." },
      ],
    },
    dialogue: {
      context: "A group discussion in class.",
      lines: [
        { speaker: "Teacher", en: "Should students use phones in class?", hi: "क्या छात्रों को क्लास में फ़ोन इस्तेमाल करना चाहिए?" },
        { speaker: "Simran", en: "I think phones are useful because we can look up words quickly.", hi: "मुझे लगता है फ़ोन उपयोगी हैं क्योंकि हम जल्दी शब्द देख सकते हैं।" },
        { speaker: "Yash", en: "I see your point, but they can also be distracting.", hi: "मैं तुम्हारी बात समझता हूँ, लेकिन वे ध्यान भी भटका सकते हैं।" },
        { speaker: "Simran", en: "That’s true. Maybe we can use them only for learning apps.", hi: "यह सही है। शायद हम उन्हें सिर्फ़ लर्निंग ऐप्स के लिए इस्तेमाल करें।" },
      ],
    },
    exercise: [
      { kind: "translate", hi: "मुझे लगता है कि यह एक अच्छा विचार है।", accepted: ["I think this is a good idea.", "I think it's a good idea.", "I think it is a good idea.", "I think that this is a good idea.", "I think that's a good idea."], feedback: "I think + sentence." },
      { kind: "mcq", prompt: "Polite disagreement:", options: ["You are wrong.", "I see your point, but I feel differently.", "No, never."], answer: "I see your point, but I feel differently.", feedback: "Respectful and clear." },
      { kind: "translate", hi: "मेरी राय में, यह बेहतर है।", accepted: ["In my opinion, this is better.", "In my opinion, it is better.", "In my opinion, it's better.", "I think this is better."], feedback: "In my opinion, …" },
    ],
    speaking: {
      prompt: { en: "Is it better to live in a big city or a small town? Give your opinion, a reason and an example.", hi: "बड़े शहर में रहना बेहतर है या छोटे शहर में? राय, कारण और उदाहरण दें।" },
      sample: "I think a small town is better because life is calmer. For example, in my hometown I can walk to the market in five minutes.",
      tip: { en: "There’s no wrong opinion — focus on explaining it clearly.", hi: "कोई राय ग़लत नहीं होती — बस उसे साफ़ समझाने पर ध्यान दें।" },
    },
    recap: ["I think / In my opinion…", "because + reason", "For example + example", "I see your point, but…"],
  },
];

export const lessons: Lesson[] = rawLessons.map((l) => ({
  ...l,
  exercise: l.exercise.map((e) => (e.kind === "translate" ? { ...e, accepted: withExtra(e.hi, e.accepted) } : e)),
}));

export function getLesson(id: string) {
  return lessons.find((l) => l.id === id);
}
