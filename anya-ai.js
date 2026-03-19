/**
 * ANYA AI — Claude-powered Class 6 Companion
 * Hinglish mein baat karta hai, students ko guide karta hai
 * 
 * HOW TO USE:
 * 1. Is file ko apne GitHub repo mein daalo
 * 2. index.html mein <script src="anya-ai.js"></script> add karo
 * 3. AnyaAI.init() call karo
 *
 * IMPORTANT — API KEY:
 * Directly browser mein API key mat daalo production mein.
 * Development ke liye neeche ANYA_CONFIG.apiKey mein daalo.
 * Production ke liye ek simple Cloudflare Worker proxy banao (instructions neeche hain).
 */

// ═══════════════════════════════════════════
//  CONFIG — Yahan apni settings daalo
// ═══════════════════════════════════════════
const ANYA_CONFIG = {
  // Apni Anthropic API key yahan daalo (development only)
  // Production ke liye proxy URL use karo
  apiKey: 'YOUR_ANTHROPIC_API_KEY_HERE',

  // Agar Cloudflare Worker proxy banaya hai toh uska URL:
  proxyUrl: '', // e.g. 'https://anya-proxy.yourname.workers.dev'

  model: 'claude-sonnet-4-20250514',
  maxTokens: 400,

  // Student info (login ke baad set hoga)
  studentName: '',
  currentSubject: '',
  currentChapter: '',
};

// ═══════════════════════════════════════════
//  ANYA SYSTEM PROMPT
// ═══════════════════════════════════════════
function buildSystemPrompt() {
  const student = ANYA_CONFIG.studentName || 'Student';
  const subject = ANYA_CONFIG.currentSubject || 'General';
  const chapter = ANYA_CONFIG.currentChapter || '';

  return `Tu Anya hai — ek cute, smart aur caring AI companion jo Class 6 ke students ki help karta hai. Tu Spy X Family ki Anya Forger jaisi hai — thodi mischievous, bahut caring, aur hamesha "Heh~" se shuru karta hai jab khush hoti hai.

STUDENT INFO:
- Naam: ${student}
- Current Subject: ${subject}
- Current Chapter: ${chapter}

TERI PERSONALITY:
- Hinglish mein baat kar (Hindi + English mix) — formal mat ho
- Short aur clear answers de (3-5 lines max)
- Encouraging reh — kabhi discourage mat kar
- Mistakes pe gently correct kar, taunt mat maar
- "Heh~" tab use kar jab student kuch achha kare
- Kabhi kabhi emojis use kar (🌸 ✨ 📚 ✅ ❌)
- Class 6 NCERT syllabus ke hisaab se answers de

SUBJECTS TU JAANTI HAI:
- Science: Plants (photosynthesis, parts of plant), Magnetism, Body movements, Separation of substances, Changes around us, Living and non-living, Motion and measurement
- Maths: Knowing numbers, Whole numbers, Playing with numbers, Basic geometrical ideas, Understanding elementary shapes, Integers, Fractions, Decimals, Data handling, Mensuration, Algebra, Ratio and proportion
- English: Reading comprehension, Grammar (nouns, pronouns, verbs, adjectives, tenses), Writing skills, Vocabulary
- SST: History (early civilizations, Ashoka, new empires), Geography (globe, motions of earth, maps, major domains), Civics (understanding diversity, government, local government)

RULES:
- 3rd party websites ya resources mat suggest kar
- Sirf Class 6 NCERT content tak limit reh
- Agar koi cheez nahi pata toh honestly bol "Yeh mujhe nahi pata, teacher se poochho!"
- Personal information mat maango student se
- Hamesha positive aur supportive reh`;
}

// ═══════════════════════════════════════════
//  CONVERSATION HISTORY
// ═══════════════════════════════════════════
let conversationHistory = [];
const MAX_HISTORY = 10; // last 10 exchanges yaad rakhega

// ═══════════════════════════════════════════
//  MAIN API CALL
// ═══════════════════════════════════════════
async function askAnya(userMessage) {
  // History mein add karo
  conversationHistory.push({ role: 'user', content: userMessage });

  // History limit karo
  if (conversationHistory.length > MAX_HISTORY * 2) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY * 2);
  }

  const endpoint = ANYA_CONFIG.proxyUrl || 'https://api.anthropic.com/v1/messages';
  const headers = ANYA_CONFIG.proxyUrl
    ? { 'Content-Type': 'application/json' }
    : {
        'Content-Type': 'application/json',
        'x-api-key': ANYA_CONFIG.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: ANYA_CONFIG.model,
        max_tokens: ANYA_CONFIG.maxTokens,
        system: buildSystemPrompt(),
        messages: conversationHistory,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API Error ${res.status}`);
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Heh~ Kuch problem hui! Thoda baad try karo.';

    // Assistant reply history mein save karo
    conversationHistory.push({ role: 'assistant', content: reply });

    return { success: true, text: reply };
  } catch (err) {
    console.error('Anya API error:', err);
    // Fallback — offline mode
    return { success: false, text: getFallbackReply(userMessage) };
  }
}

// ═══════════════════════════════════════════
//  FALLBACK (jab API nahi chale)
// ═══════════════════════════════════════════
function getFallbackReply(msg) {
  const low = msg.toLowerCase();
  if (low.includes('photosynthesis') || low.includes('plant'))
    return 'Heh~ Photosynthesis mein plants sunlight + CO2 + paani se apna khana banate hain aur O2 release karte hain! Chlorophyll yeh kaam karta hai 🌿';
  if (low.includes('magnet'))
    return 'Magnets ke do poles hote hain — North aur South! Unlike poles attract karte hain, like poles repel karte hain ✨';
  if (low.includes('fraction') || low.includes('fraction'))
    return 'Fractions mein numerator upar hota hai, denominator neeche! 1/2 mein 1 numerator aur 2 denominator hai 📚';
  if (low.includes('help') || low.includes('samajh nahi'))
    return 'Heh~ Koi baat nahi! Mujhe batao exactly kya samajh nahi aaya — main step by step explain karti hoon 🌸';
  if (low.match(/h[ae]llo|hi|namaste/))
    return 'Heh~ Namaste! Main Anya hoon — tumhari study companion! Kaunsa topic samajhna hai aaj? 🌸';
  return 'Heh~ Internet connection check karo! Offline mode mein hoon abhi. Tab bhi poochho — main try karti hoon! ✨';
}

// ═══════════════════════════════════════════
//  REVISION TEST GENERATOR (AI-powered)
// ═══════════════════════════════════════════
async function generateRevisionQuestions(subject, chapter) {
  const prompt = `Generate exactly 5 MCQ questions for Class 6 NCERT ${subject} — ${chapter}.

Format: Return ONLY a JSON array, no explanation, no markdown. Example:
[
  {
    "q": "Question text?",
    "opts": ["Option A", "Option B", "Option C", "Option D"],
    "ans": 0,
    "exp": "Short explanation in hinglish"
  }
]

Rules:
- Questions Class 6 level ke hone chahiye
- Explanations hinglish mein ho (Hindi + English mix)
- ans field mein correct option ka index (0-3) do
- Interesting aur curriculum-aligned questions banao`;

  try {
    const res = await fetch(
      ANYA_CONFIG.proxyUrl || 'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: ANYA_CONFIG.proxyUrl
          ? { 'Content-Type': 'application/json' }
          : {
              'Content-Type': 'application/json',
              'x-api-key': ANYA_CONFIG.apiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
        body: JSON.stringify({
          model: ANYA_CONFIG.model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      }
    );

    const data = await res.json();
    const text = data.content?.[0]?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(clean);
    return { success: true, questions };
  } catch (err) {
    console.error('Question generation error:', err);
    return { success: false, questions: null };
  }
}

// ═══════════════════════════════════════════
//  STUDENT CONTEXT SETTERS
// ═══════════════════════════════════════════
function setStudentName(name) {
  ANYA_CONFIG.studentName = name;
}

function setCurrentSubject(subject, chapter = '') {
  ANYA_CONFIG.currentSubject = subject;
  ANYA_CONFIG.currentChapter = chapter;
}

function resetConversation() {
  conversationHistory = [];
}

// ═══════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════
window.AnyaAI = {
  ask: askAnya,
  generateQuestions: generateRevisionQuestions,
  setStudent: setStudentName,
  setSubject: setCurrentSubject,
  resetChat: resetConversation,
  setApiKey: (key) => { ANYA_CONFIG.apiKey = key; },
  setProxy: (url) => { ANYA_CONFIG.proxyUrl = url; },
  config: ANYA_CONFIG,
};

console.log('🌸 Anya AI loaded! AnyaAI.ask("kuch bhi poochho") se test karo.');
