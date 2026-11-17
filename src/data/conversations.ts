/**
 * Demo-mode conversations. These are curated, branching scripts — NOT live AI.
 * The UI always labels them as scripted sample coaching.
 */
import type { Bi } from "./lessons";

export type Branch = { keywords: string[]; reply: Bi };
export type Turn = {
  tutor: Bi;
  hint: string;
  suggestions: string[];
  branches?: Branch[];
  fallback?: Bi;
  usefulPhrase: { en: string; hi: string };
};

export type Topic = {
  id: string;
  title: string;
  titleHi: string;
  emoji: string;
  icon: "Hand" | "Sun" | "UtensilsCrossed" | "ShoppingBag" | "Plane" | "GraduationCap" | "Building2" | "BriefcaseBusiness" | "Phone" | "LifeBuoy";
  scenario: string;
  turns: Turn[];
  closing: Bi;
};

const ok = (en: string, hi: string): Bi => ({ en, hi });

export const topics: Topic[] = [
  {
    id: "introductions",
    title: "Introductions",
    titleHi: "परिचय",
    emoji: "👋",
    icon: "Hand",
    scenario: "You meet Mira at a community English club.",
    turns: [
      {
        tutor: ok("Hi! I’m Mira. What’s your name?", "नमस्ते! मैं मीरा हूँ। आपका नाम क्या है?"),
        hint: "अपना नाम बताइए: “My name is…” या “I’m…”",
        suggestions: ["Hi Mira, I’m Arjun.", "My name is Pooja. Nice to meet you."],
        fallback: ok("Lovely to meet you!", "आपसे मिलकर अच्छा लगा!"),
        usefulPhrase: { en: "Nice to meet you.", hi: "आपसे मिलकर अच्छा लगा।" },
      },
      {
        tutor: ok("Where are you from?", "आप कहाँ से हैं?"),
        hint: "शहर बताइए: “I’m from…”",
        suggestions: ["I’m from Lucknow.", "I’m from a small town near Patna."],
        branches: [
          { keywords: ["delhi", "mumbai", "bengaluru", "bangalore", "kolkata", "chennai", "hyderabad", "pune"], reply: ok("Oh, a big city! It must be busy.", "अरे, बड़ा शहर! वहाँ बहुत भीड़ होगी।") },
          { keywords: ["village", "small", "town"], reply: ok("Nice! Small towns are usually peaceful.", "बढ़िया! छोटे शहर अक्सर शांत होते हैं।") },
        ],
        fallback: ok("That sounds like a nice place.", "अच्छी जगह लगती है।"),
        usefulPhrase: { en: "I’m from…", hi: "मैं … से हूँ।" },
      },
      {
        tutor: ok("What do you do?", "आप क्या करते हैं?"),
        hint: "काम या पढ़ाई बताइए: “I’m a student / I work as…”",
        suggestions: ["I’m a college student.", "I work as an accountant."],
        branches: [
          { keywords: ["student", "college", "study", "school"], reply: ok("Great! Studying is a good time to build your English.", "बढ़िया! पढ़ाई के समय अंग्रेज़ी सुधारना अच्छा है।") },
          { keywords: ["work", "job", "engineer", "teacher", "accountant", "manager", "business"], reply: ok("Interesting! English will help you a lot at work.", "दिलचस्प! काम में अंग्रेज़ी बहुत मदद करेगी।") },
        ],
        fallback: ok("Thanks for sharing!", "बताने के लिए धन्यवाद!"),
        usefulPhrase: { en: "I work as a/an…", hi: "मैं … के रूप में काम करता/करती हूँ।" },
      },
      {
        tutor: ok("Why do you want to improve your English?", "आप अपनी अंग्रेज़ी क्यों सुधारना चाहते हैं?"),
        hint: "कारण बताइए: “I want to… because…”",
        suggestions: ["I want to speak confidently at work.", "I want to prepare for interviews."],
        fallback: ok("That’s a great reason.", "यह बहुत अच्छा कारण है।"),
        usefulPhrase: { en: "I want to… because…", hi: "मैं … चाहता हूँ क्योंकि…" },
      },
    ],
    closing: ok("It was really nice meeting you. See you next time!", "आपसे मिलकर सच में अच्छा लगा। फिर मिलेंगे!"),
  },
  {
    id: "daily-routine",
    title: "Daily routine",
    titleHi: "दिनचर्या",
    emoji: "☀️",
    icon: "Sun",
    scenario: "Mira asks about your usual day.",
    turns: [
      {
        tutor: ok("What time do you usually wake up?", "आप आमतौर पर कितने बजे उठते हैं?"),
        hint: "“I usually wake up at…”",
        suggestions: ["I usually wake up at six.", "I wake up at around seven thirty."],
        branches: [
          { keywords: ["five", "5", "six", "6", "early"], reply: ok("Wow, you’re an early riser!", "वाह, आप तो जल्दी उठते हैं!") },
          { keywords: ["nine", "9", "ten", "10", "late"], reply: ok("Nice, you get a good amount of sleep!", "बढ़िया, आपकी नींद अच्छी पूरी होती है!") },
        ],
        fallback: ok("Got it.", "समझ गई।"),
        usefulPhrase: { en: "I usually wake up at…", hi: "मैं आमतौर पर … बजे उठता हूँ।" },
      },
      {
        tutor: ok("What do you do after you wake up?", "उठने के बाद आप क्या करते हैं?"),
        hint: "क्रम से बताइए: “First…, then…”",
        suggestions: ["First I drink water, then I go for a walk.", "I take a shower and have breakfast."],
        fallback: ok("That sounds like a good start to the day.", "दिन की अच्छी शुरुआत लगती है।"),
        usefulPhrase: { en: "First…, then…", hi: "पहले…, फिर…" },
      },
      {
        tutor: ok("How do you get to work or college?", "आप काम या कॉलेज कैसे जाते हैं?"),
        hint: "“I go by bus / metro / bike.” या “I walk.”",
        suggestions: ["I go by metro.", "I usually walk to college."],
        fallback: ok("Okay, that sounds convenient.", "अच्छा, यह सुविधाजनक लगता है।"),
        usefulPhrase: { en: "I go by bus / metro.", hi: "मैं बस / मेट्रो से जाता हूँ।" },
      },
      {
        tutor: ok("What do you like to do in the evening?", "शाम को आपको क्या करना पसंद है?"),
        hint: "“I like to… / I enjoy + -ing”",
        suggestions: ["I like to watch cricket.", "I enjoy cooking with my family."],
        fallback: ok("That sounds relaxing.", "आरामदायक लगता है।"),
        usefulPhrase: { en: "I enjoy + -ing", hi: "मुझे … करना अच्छा लगता है।" },
      },
    ],
    closing: ok("Thanks for telling me about your day. You described it clearly!", "अपने दिन के बारे में बताने के लिए धन्यवाद!"),
  },
  {
    id: "ordering-food",
    title: "Ordering food",
    titleHi: "खाना ऑर्डर करना",
    emoji: "🍛",
    icon: "UtensilsCrossed",
    scenario: "Mira is a waiter at a café. Order your meal.",
    turns: [
      {
        tutor: ok("Good evening! Are you ready to order?", "शुभ संध्या! क्या आप ऑर्डर करने के लिए तैयार हैं?"),
        hint: "विनम्रता से ऑर्डर करें: “I’d like…”",
        suggestions: ["Yes, I’d like a masala dosa, please.", "Could I have a veg sandwich?"],
        branches: [
          { keywords: ["not yet", "minute", "few minutes", "no"], reply: ok("No problem, take your time. I’ll note your order when you’re ready.", "कोई बात नहीं, आराम से। जब तैयार हों, मैं ऑर्डर लिख लूँगी।") },
        ],
        fallback: ok("Great choice!", "बढ़िया चुनाव!"),
        usefulPhrase: { en: "I’d like…, please.", hi: "मुझे … चाहिए।" },
      },
      {
        tutor: ok("Would you like anything to drink?", "क्या आप पीने के लिए कुछ लेंगे?"),
        hint: "“Could I have…?” या “No, thank you.”",
        suggestions: ["Could I have a cold coffee?", "Just water, please."],
        branches: [{ keywords: ["no", "nothing"], reply: ok("Sure, no drinks.", "ठीक है, कोई ड्रिंक नहीं।") }],
        fallback: ok("Coming right up.", "अभी लाती हूँ।"),
        usefulPhrase: { en: "Could I have…?", hi: "क्या मुझे … मिल सकता है?" },
      },
      {
        tutor: ok("How spicy would you like it?", "आपको कितना तीखा चाहिए?"),
        hint: "“Less spicy, please.” / “Medium is fine.”",
        suggestions: ["Less spicy, please.", "Medium spicy is fine."],
        fallback: ok("Noted!", "नोट कर लिया!"),
        usefulPhrase: { en: "Less spicy, please.", hi: "कम तीखा, प्लीज़।" },
      },
      {
        tutor: ok("Here’s your food. Is everything okay?", "यह रहा आपका खाना। सब ठीक है?"),
        hint: "तारीफ़ करें या बिल माँगें: “It’s delicious. Could I have the bill?”",
        suggestions: ["It’s delicious, thank you!", "Yes. Could I have the bill, please?"],
        fallback: ok("Happy to hear that!", "सुनकर अच्छा लगा!"),
        usefulPhrase: { en: "Could I have the bill, please?", hi: "क्या मुझे बिल मिल सकता है?" },
      },
    ],
    closing: ok("Thank you for visiting! You ordered very politely.", "आने के लिए धन्यवाद!"),
  },
  {
    id: "shopping",
    title: "Shopping",
    titleHi: "खरीदारी",
    emoji: "🛍️",
    icon: "ShoppingBag",
    scenario: "Mira is a shopkeeper in a clothing store.",
    turns: [
      {
        tutor: ok("Hello! Can I help you find something?", "नमस्ते! क्या मैं कुछ ढूँढने में मदद करूँ?"),
        hint: "बताइए क्या चाहिए: “I’m looking for…”",
        suggestions: ["I’m looking for a shirt.", "Yes, I need a pair of jeans."],
        branches: [{ keywords: ["just looking", "browsing", "no thanks"], reply: ok("Sure, take your time. Let me know if you see something you like.", "ज़रूर, आराम से देखिए।") }],
        fallback: ok("We have lots of options.", "हमारे पास कई विकल्प हैं।"),
        usefulPhrase: { en: "I’m looking for…", hi: "मैं … ढूँढ रहा हूँ।" },
      },
      {
        tutor: ok("What size do you wear?", "आप कौन-सा साइज़ पहनते हैं?"),
        hint: "“I wear medium / size 40.”",
        suggestions: ["I wear medium.", "Size 40, I think."],
        fallback: ok("Let me check.", "मैं देखती हूँ।"),
        usefulPhrase: { en: "I wear size…", hi: "मैं … साइज़ पहनता हूँ।" },
      },
      {
        tutor: ok("This one is ₹900. Would you like to try it on?", "यह ₹900 का है। क्या आप पहनकर देखना चाहेंगे?"),
        hint: "हाँ कहें या दूसरा रंग पूछें: “Do you have it in blue?”",
        suggestions: ["Yes, please. Where is the trial room?", "Do you have it in blue?"],
        branches: [{ keywords: ["blue", "black", "colour", "color", "green", "red", "white"], reply: ok("Yes, we have it in that colour too!", "हाँ, वह रंग भी है!") }],
        fallback: ok("Of course.", "बिलकुल।"),
        usefulPhrase: { en: "Do you have it in…?", hi: "क्या यह … में है?" },
      },
      {
        tutor: ok("So, would you like to buy it?", "तो, क्या आप इसे ख़रीदना चाहेंगे?"),
        hint: "“Yes, I’ll take it.” या विनम्रता से मना: “I’ll think about it.”",
        suggestions: ["Yes, I’ll take it.", "I’ll think about it, thanks."],
        fallback: ok("No problem at all.", "कोई बात नहीं।"),
        usefulPhrase: { en: "I’ll take it.", hi: "मैं इसे ले लूँगा।" },
      },
    ],
    closing: ok("Thanks for shopping with us. Have a great day!", "ख़रीदारी के लिए धन्यवाद!"),
  },
  {
    id: "travel",
    title: "Travel",
    titleHi: "यात्रा",
    emoji: "🚆",
    icon: "Plane",
    scenario: "Mira works at a railway enquiry counter.",
    turns: [
      {
        tutor: ok("Hello, how can I help you?", "नमस्ते, मैं आपकी क्या मदद कर सकती हूँ?"),
        hint: "पूछिए: “Which platform does the train to … leave from?”",
        suggestions: ["Which platform does the Jaipur train leave from?", "Is the Shatabdi on time?"],
        fallback: ok("Let me check the board.", "मैं बोर्ड देखती हूँ।"),
        usefulPhrase: { en: "Which platform does the train leave from?", hi: "ट्रेन किस प्लेटफ़ॉर्म से जाती है?" },
      },
      {
        tutor: ok("It’s on platform 4, but it’s delayed by thirty minutes.", "प्लेटफ़ॉर्म 4 पर है, पर तीस मिनट लेट है।"),
        hint: "प्रतिक्रिया दें या पूछें कि कहाँ इंतज़ार करें।",
        suggestions: ["Oh, okay. Is there a waiting room?", "Thanks. Where can I get some tea?"],
        fallback: ok("Sorry for the delay.", "देरी के लिए खेद है।"),
        usefulPhrase: { en: "Is there a waiting room?", hi: "क्या यहाँ वेटिंग रूम है?" },
      },
      {
        tutor: ok("The waiting room is next to the ticket counter. Anything else?", "वेटिंग रूम टिकट काउंटर के बगल में है। और कुछ?"),
        hint: "सामान के बारे में या टिकट के बारे में पूछें।",
        suggestions: ["Where can I keep my luggage?", "No, that’s all. Thank you."],
        branches: [{ keywords: ["that's all", "thats all", "no", "thank"], reply: ok("You’re welcome!", "आपका स्वागत है!") }],
        fallback: ok("The cloakroom is near gate 2.", "क्लॉकरूम गेट 2 के पास है।"),
        usefulPhrase: { en: "That’s all, thank you.", hi: "बस इतना ही, धन्यवाद।" },
      },
      {
        tutor: ok("Where are you travelling to, by the way?", "वैसे, आप कहाँ जा रहे हैं?"),
        hint: "“I’m travelling to… for…”",
        suggestions: ["I’m going to Jaipur for a wedding.", "I’m visiting my family in Agra."],
        fallback: ok("Have a wonderful trip!", "आपकी यात्रा शानदार हो!"),
        usefulPhrase: { en: "I’m travelling to… for…", hi: "मैं … के लिए … जा रहा हूँ।" },
      },
    ],
    closing: ok("Have a safe journey!", "आपकी यात्रा सुरक्षित हो!"),
  },
  {
    id: "college",
    title: "College life",
    titleHi: "कॉलेज लाइफ़",
    emoji: "🎓",
    icon: "GraduationCap",
    scenario: "Mira is a new classmate on the first day.",
    turns: [
      {
        tutor: ok("Hi! Is this seat free?", "हाय! क्या यह सीट ख़ाली है?"),
        hint: "“Yes, please sit.” / “Sorry, it’s taken.”",
        suggestions: ["Yes, please sit.", "Sure, go ahead."],
        fallback: ok("Thanks!", "धन्यवाद!"),
        usefulPhrase: { en: "Sure, go ahead.", hi: "हाँ, बैठिए।" },
      },
      {
        tutor: ok("Which course are you in?", "आप किस कोर्स में हैं?"),
        hint: "“I’m doing B.Com / B.Tech in…”",
        suggestions: ["I’m doing B.Com.", "I’m in the first year of B.Tech."],
        fallback: ok("Oh nice, me too!", "अरे वाह, मैं भी!"),
        usefulPhrase: { en: "I’m doing a degree in…", hi: "मैं … में डिग्री कर रहा हूँ।" },
      },
      {
        tutor: ok("Which subject do you find the most difficult?", "आपको कौन-सा विषय सबसे कठिन लगता है?"),
        hint: "“I find … difficult because…”",
        suggestions: ["I find maths difficult.", "Accounts is hard for me because of the formulas."],
        fallback: ok("Maybe we can study together!", "शायद हम साथ पढ़ सकते हैं!"),
        usefulPhrase: { en: "I find … difficult.", hi: "मुझे … कठिन लगता है।" },
      },
      {
        tutor: ok("Do you want to join the study group on Saturday?", "क्या आप शनिवार को स्टडी ग्रुप में आना चाहेंगे?"),
        hint: "“Sure, what time?” / “Sorry, I’m busy on Saturday.”",
        suggestions: ["Sure! What time?", "Sorry, I’m busy this Saturday."],
        branches: [{ keywords: ["busy", "sorry", "can't", "cannot"], reply: ok("No worries, maybe next time.", "कोई बात नहीं, अगली बार।") }],
        fallback: ok("Great, it’s at 11 in the library.", "बढ़िया, 11 बजे लाइब्रेरी में।"),
        usefulPhrase: { en: "Sorry, I’m busy this Saturday.", hi: "माफ़ कीजिए, इस शनिवार मैं व्यस्त हूँ।" },
      },
    ],
    closing: ok("See you in class!", "क्लास में मिलते हैं!"),
  },
  {
    id: "workplace",
    title: "Workplace conversations",
    titleHi: "ऑफ़िस की बातचीत",
    emoji: "🏢",
    icon: "Building2",
    scenario: "Mira is your team lead checking in on a task.",
    turns: [
      {
        tutor: ok("Hi! How is the report coming along?", "हाय! रिपोर्ट कैसी चल रही है?"),
        hint: "स्टेटस बताइए: “It’s almost done.” / “I’m working on it.”",
        suggestions: ["It’s almost done.", "I’m still working on it."],
        branches: [{ keywords: ["problem", "stuck", "help", "issue"], reply: ok("Thanks for telling me early. We’ll sort it out together.", "जल्दी बताने के लिए धन्यवाद। हम साथ मिलकर सुलझा लेंगे।") }],
        fallback: ok("Good to hear.", "सुनकर अच्छा लगा।"),
        usefulPhrase: { en: "I’m still working on it.", hi: "मैं अभी इस पर काम कर रहा हूँ।" },
      },
      {
        tutor: ok("Can you finish it by Thursday?", "क्या आप इसे गुरुवार तक पूरा कर सकते हैं?"),
        hint: "“Yes, I can.” या “Could I have until Friday?”",
        suggestions: ["Yes, I’ll send it by Thursday.", "Could I have until Friday morning?"],
        branches: [{ keywords: ["friday", "more time", "until"], reply: ok("Friday morning is fine.", "शुक्रवार सुबह ठीक है।") }],
        fallback: ok("Perfect.", "बढ़िया।"),
        usefulPhrase: { en: "Could I have until Friday?", hi: "क्या मुझे शुक्रवार तक का समय मिल सकता है?" },
      },
      {
        tutor: ok("Do you need any help from the team?", "क्या आपको टीम से कोई मदद चाहिए?"),
        hint: "“Yes, could someone…?” / “No, I’m fine, thanks.”",
        suggestions: ["Could someone check the numbers?", "No, I’m fine, thanks."],
        fallback: ok("Okay, let me know anytime.", "ठीक है, कभी भी बताइए।"),
        usefulPhrase: { en: "Could someone check…?", hi: "क्या कोई … चेक कर सकता है?" },
      },
      {
        tutor: ok("Great work this week, by the way.", "वैसे, इस हफ़्ते बढ़िया काम किया।"),
        hint: "धन्यवाद कहें: “Thank you, I appreciate it.”",
        suggestions: ["Thank you, I appreciate it.", "Thanks! The team helped a lot."],
        fallback: ok("You deserve it.", "आप इसके हक़दार हैं।"),
        usefulPhrase: { en: "Thank you, I appreciate it.", hi: "धन्यवाद, मैं इसकी सराहना करता हूँ।" },
      },
    ],
    closing: ok("Talk to you later. Have a productive day!", "बाद में बात करते हैं!"),
  },
  {
    id: "interviews",
    title: "Job interviews",
    titleHi: "जॉब इंटरव्यू",
    emoji: "💼",
    icon: "BriefcaseBusiness",
    scenario: "Mira plays an interviewer for an entry-level role.",
    turns: [
      {
        tutor: ok("Thanks for coming in. Please tell me about yourself.", "आने के लिए धन्यवाद। कृपया अपने बारे में बताइए।"),
        hint: "Present → Past → Future: अभी क्या करते हैं, पहले क्या किया, आगे क्या चाहते हैं।",
        suggestions: ["I’m a recent commerce graduate. I did an internship in accounts, and now I’m looking for a full-time role.", "I currently work in customer support, and I want to grow into a team lead role."],
        fallback: ok("Thank you, that’s helpful.", "धन्यवाद, यह उपयोगी है।"),
        usefulPhrase: { en: "I’m currently… / Before that, I… / Now I’m looking for…", hi: "मैं अभी… / उससे पहले… / अब मैं … ढूँढ रहा हूँ।" },
      },
      {
        tutor: ok("What is your biggest strength?", "आपकी सबसे बड़ी ख़ूबी क्या है?"),
        hint: "ख़ूबी + उदाहरण: “My biggest strength is… For example…”",
        suggestions: ["My biggest strength is patience. For example, I handle angry customers calmly.", "I’m a quick learner. I learned Excel in two weeks."],
        fallback: ok("That’s a useful strength.", "यह उपयोगी ख़ूबी है।"),
        usefulPhrase: { en: "My biggest strength is…", hi: "मेरी सबसे बड़ी ख़ूबी … है।" },
      },
      {
        tutor: ok("Why do you want to work with us?", "आप हमारे साथ क्यों काम करना चाहते हैं?"),
        hint: "कंपनी से जोड़िए: “I like that your company…”",
        suggestions: ["I like that your company trains new employees well.", "I want to work in a growing team where I can learn."],
        fallback: ok("I see.", "समझ गई।"),
        usefulPhrase: { en: "I’d like to work here because…", hi: "मैं यहाँ काम करना चाहता हूँ क्योंकि…" },
      },
      {
        tutor: ok("Do you have any questions for me?", "क्या आपके कोई सवाल हैं?"),
        hint: "हमेशा एक सवाल पूछें: “What does a typical day look like?”",
        suggestions: ["What does a typical day look like in this role?", "What are the next steps in the process?"],
        fallback: ok("Good question!", "अच्छा सवाल!"),
        usefulPhrase: { en: "What are the next steps?", hi: "अगले क़दम क्या हैं?" },
      },
    ],
    closing: ok("Thank you for your time. We’ll be in touch.", "आपके समय के लिए धन्यवाद। हम संपर्क करेंगे।"),
  },
  {
    id: "phone-calls",
    title: "Phone calls",
    titleHi: "फ़ोन कॉल",
    emoji: "📞",
    icon: "Phone",
    scenario: "You call a clinic to book an appointment. Mira is the receptionist.",
    turns: [
      {
        tutor: ok("Good morning, City Clinic. How can I help you?", "सुप्रभात, सिटी क्लिनिक। मैं आपकी क्या मदद कर सकती हूँ?"),
        hint: "“Hi, this is… I’d like to book an appointment.”",
        suggestions: ["Hi, this is Ravi. I’d like to book an appointment.", "Hello, I want to see Dr. Mehta, please."],
        fallback: ok("Sure, I can help with that.", "ज़रूर, मैं मदद कर सकती हूँ।"),
        usefulPhrase: { en: "I’d like to book an appointment.", hi: "मैं अपॉइंटमेंट बुक करना चाहता हूँ।" },
      },
      {
        tutor: ok("Which day works for you?", "आपके लिए कौन-सा दिन ठीक रहेगा?"),
        hint: "“Is Tuesday morning possible?”",
        suggestions: ["Is Tuesday morning possible?", "Any time on Friday is fine."],
        fallback: ok("Let me check the schedule.", "मैं शेड्यूल देखती हूँ।"),
        usefulPhrase: { en: "Is … possible?", hi: "क्या … संभव है?" },
      },
      {
        tutor: ok("Sorry, you’re breaking up. Could you repeat that?", "माफ़ कीजिए, आवाज़ कट रही है। क्या आप दोहरा सकते हैं?"),
        hint: "धीरे और साफ़ दोहराइए।",
        suggestions: ["Sure. Tuesday morning, please.", "Can you hear me now? Tuesday, please."],
        fallback: ok("Yes, I can hear you now.", "हाँ, अब सुनाई दे रहा है।"),
        usefulPhrase: { en: "Can you hear me now?", hi: "क्या अब आपको सुनाई दे रहा है?" },
      },
      {
        tutor: ok("You’re booked for Tuesday at 10 a.m. Anything else?", "आपका मंगलवार सुबह 10 बजे का अपॉइंटमेंट बुक है। और कुछ?"),
        hint: "“No, that’s all. Thank you!”",
        suggestions: ["No, that’s all. Thank you!", "Should I bring my old reports?"],
        branches: [{ keywords: ["report", "bring", "document"], reply: ok("Yes, please bring them.", "हाँ, कृपया ले आइए।") }],
        fallback: ok("You’re welcome!", "आपका स्वागत है!"),
        usefulPhrase: { en: "That’s all, thank you.", hi: "बस इतना ही, धन्यवाद।" },
      },
    ],
    closing: ok("See you on Tuesday. Goodbye!", "मंगलवार को मिलते हैं। अलविदा!"),
  },
  {
    id: "asking-help",
    title: "Asking for help",
    titleHi: "मदद माँगना",
    emoji: "🛟",
    icon: "LifeBuoy",
    scenario: "You’re lost in a new city. Mira is a helpful passer-by.",
    turns: [
      {
        tutor: ok("You look a little lost. Can I help?", "आप थोड़े खोए हुए लग रहे हैं। क्या मैं मदद करूँ?"),
        hint: "“Yes, please. I’m looking for…”",
        suggestions: ["Yes, please. I’m looking for the metro station.", "Thank you! Where is the nearest ATM?"],
        fallback: ok("Sure, tell me where you need to go.", "ज़रूर, बताइए कहाँ जाना है।"),
        usefulPhrase: { en: "I’m looking for…", hi: "मैं … ढूँढ रहा हूँ।" },
      },
      {
        tutor: ok("Go straight and turn left at the signal. It’s next to a bank.", "सीधे जाइए और सिग्नल पर बाएँ मुड़िए। यह एक बैंक के बगल में है।"),
        hint: "दोहराकर पक्का करें: “So, straight and then left?”",
        suggestions: ["So, straight and then left?", "Sorry, could you repeat that?"],
        branches: [{ keywords: ["repeat", "again", "sorry"], reply: ok("Of course: straight, then left at the signal.", "ज़रूर: सीधे, फिर सिग्नल पर बाएँ।") }],
        fallback: ok("Exactly!", "बिलकुल सही!"),
        usefulPhrase: { en: "So, straight and then left?", hi: "तो, सीधे और फिर बाएँ?" },
      },
      {
        tutor: ok("Is there anything else you need?", "क्या आपको और कुछ चाहिए?"),
        hint: "“Is it far?” / “How long does it take on foot?”",
        suggestions: ["Is it far from here?", "How long does it take on foot?"],
        fallback: ok("It’s about five minutes on foot.", "पैदल लगभग पाँच मिनट।"),
        usefulPhrase: { en: "Is it far from here?", hi: "क्या यह यहाँ से दूर है?" },
      },
      {
        tutor: ok("Okay, good luck!", "ठीक है, शुभकामनाएँ!"),
        hint: "धन्यवाद कहें: “Thank you so much for your help!”",
        suggestions: ["Thank you so much for your help!", "Thanks a lot, have a nice day!"],
        fallback: ok("You’re welcome!", "आपका स्वागत है!"),
        usefulPhrase: { en: "Thank you so much for your help!", hi: "आपकी मदद के लिए बहुत-बहुत धन्यवाद!" },
      },
    ],
    closing: ok("Glad I could help. Take care!", "मदद करके ख़ुशी हुई। ध्यान रखिए!"),
  },
];

export function getTopic(id: string) {
  return topics.find((t) => t.id === id);
}
