/**
 * Extra correct answers, keyed by the Hindi prompt. Merged into lesson exercises and the
 * translator challenge so the same Hindi sentence accepts the same natural English everywhere.
 * (Case, punctuation, contractions, missing apostrophes, "please" and "kindly" are already ignored.)
 */
export const extraAccepted: Record<string, string[]> = {
  "मेरा नाम रवि है।": ["Ravi is my name.", "My name's Ravi."],
  "मैं दिल्ली से हूँ।": ["I belong to Delhi.", "I am from Delhi city."],
  "वे मेरे दोस्त हैं।": ["They are friends of mine."],
  "मैं खुश हूँ।": ["I feel happy.", "I am glad."],
  "स्टेशन कहाँ है?": ["Where is the train station?", "Where's the railway station?"],
  "आप कैसे हैं?": ["How are you doing today?", "How do you do?"],
  "मुझे एक गिलास पानी चाहिए।": ["I want a glass of water.", "I'd like some water.", "Could I get a glass of water?", "Can I get a glass of water?", "May I have a glass of water?", "Can I have some water?", "A glass of water."],
  "बिल ला दीजिए।": ["Please bring the bill.", "Bring the bill.", "Could you bring the bill?", "Can you bring the bill?", "Could you bring the bill, please?", "Can I have the bill?", "Could I get the bill?", "Can we get the bill?", "Check, please."],
  "यह कितने का है?": ["How much is it?", "How much does it cost?", "What does this cost?", "What is the price?", "What's the price of this?", "How much for this?"],
  "क्या मैं इसे पहनकर देख सकता हूँ?": ["Can I try it on?", "Could I try it on?", "May I try it on?"],
  "क्या मैं इसे पहनकर देख सकती हूँ?": ["Can I try it on?", "Could I try it on?", "May I try it on?", "May I try this on?"],
  "क्या आप मेरी मदद कर सकते हैं?": ["Can you please help me?", "Could you please help me?", "Will you help me?", "Would you help me?", "Would you please help me?"],
  "दाएँ मुड़िए।": ["Turn right, please.", "Please turn right.", "Go right."],
  "वह हर दिन योग करती है।": ["She does yoga daily.", "She practises yoga daily.", "She practices yoga daily.", "She does yoga every single day."],
  "मैं सात बजे नाश्ता करता हूँ।": ["I have breakfast at 7 a.m.", "I have my breakfast at seven.", "I eat breakfast at seven o'clock.", "I have breakfast at seven in the morning."],
  "मुझे यह समझ नहीं आया।": ["I didn't understand.", "I did not understand.", "I didn't understand that.", "I didn't get it.", "I didn't get this.", "I don't understand this.", "I don't understand.", "I didn't follow that.", "I couldn't understand this."],
  "हमने कल क्रिकेट खेला।": ["We played cricket yesterday evening.", "Yesterday, we played cricket."],
  "मैं इंटरव्यू की तैयारी कर रहा हूँ।": ["I'm getting ready for an interview.", "I am getting ready for an interview.", "I'm preparing for interviews.", "I am preparing for interviews.", "I'm preparing for a job interview."],
  "मैं तुम्हें बाद में फ़ोन करूँगा।": ["I'll give you a call later.", "I will give you a call later.", "I'll call you back later.", "I'll ring you later."],
  "मैं बहुत उत्साहित हूँ।": ["I'm super excited.", "I'm extremely excited.", "I'm so excited."],
  "मुझे तुम पर गर्व है।": ["I'm very proud of you.", "I am very proud of you.", "I'm so proud of you.", "I am so proud of you.", "I feel proud of you."],
  "मैं अपने माता-पिता के साथ रहता हूँ।": ["I live with my mother and father.", "I live with my mom and dad.", "I live with my parents at home.", "I'm living with my parents.", "I am living with my parents."],
  "मेरी एक छोटी बहन है।": ["I've got a younger sister.", "I have a younger sister."],
  "मैं हमेशा नाश्ता करता हूँ।": ["I always have my breakfast.", "I always take breakfast.", "I never skip breakfast."],
  "वह कभी-कभी देर से आती है।": ["She comes late at times.", "Sometimes she is late.", "She is late sometimes.", "She arrives late sometimes.", "She sometimes arrives late."],
  "मुझे टीम में काम करना पसंद है।": ["I like teamwork.", "I enjoy teamwork.", "I like working with a team.", "I enjoy working with a team."],
  "क्या आप थोड़ा धीरे बोल सकते हैं?": ["Can you speak a little slowly?", "Could you speak a bit more slowly?", "Can you speak a bit slower?", "Could you speak a little slower?", "Can you speak a little slower?", "Could you speak slower?", "Can you speak slower?", "Can you please speak slowly?", "Could you speak slowly?", "Can you slow down a little?", "Could you slow down?", "Please speak slowly.", "Please speak a little slowly."],
  "कृपया यह फ़ाइल भेज दीजिए।": ["Could you send this file?", "Can you send this file?", "Can you please send this file?", "Please send me the file.", "Could you send me this file?", "Kindly send this file."],
  "मैं आपको वापस कॉल करूँगा।": ["I'll get back to you.", "I'll call back.", "I will call back.", "I'll return your call."],
  "क्या मैं संदेश छोड़ सकता हूँ?": ["Can I leave a message, please?", "Could I leave a message for him?", "Can I leave a message for her?"],
  "मुझे एक सेकंड सोचने दीजिए।": ["Let me think.", "Let me think for a sec.", "Just a second, let me think.", "Give me a second.", "Let me think about it for a second."],
  "अच्छा सवाल है।": ["That's a great question.", "Nice question.", "Good question!"],
  "मुझे लगता है कि यह एक अच्छा विचार है।": ["I think that is a good idea.", "I feel this is a good idea.", "I believe this is a good idea.", "I think it's a nice idea."],
  "मेरी राय में, यह बेहतर है।": ["In my view, this is better.", "In my view, it is better.", "In my view, it's better.", "I feel this is better.", "I believe this is better."],
};

export function withExtra(hi: string, base: string[]) {
  return Array.from(new Set([...base, ...(extraAccepted[hi] ?? [])]));
}
