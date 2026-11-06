import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '32kb' }));

const requestBuckets = new Map<string, { count: number; resetAt: number }>();
app.use('/api/ai', (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return next();
  }
  if (bucket.count >= 20) return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  bucket.count += 1;
  return next();
});

// Initialize Gemini SDK with telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Gemini features will return informative fallbacks.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Speaking Arena AI Conversation Partner
app.post('/api/ai/conversation', async (req, res) => {
  try {
    const { scenarioTitle, scenarioDescription, messages, userLevel } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        reply: "Hello! Welcome to our English practice. Could you tell me a little about yourself?",
        malayalamExplanation: "ഹലോ! നമ്മുടെ ഇംഗ്ലീഷ് പരിശീലനത്തിലേക്ക് സ്വാഗതം. നിങ്ങളെക്കുറിച്ച് കുറച്ച് പറയാമോ?",
        suggestedReplies: [
          "My name is Rahul and I am from Kerala.",
          "I am a beginner and want to speak English.",
          "Nice to meet you! How are you?"
        ]
      });
    }

    const conversationText = (messages || [])
      .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Student' : 'Partner'}: ${m.text}`)
      .join('\n');

    const systemPrompt = `You are an encouraging, friendly English conversation tutor for absolute Malayalam-speaking beginners.
Scenario: ${scenarioTitle || 'General Conversation'} (${scenarioDescription || 'Everyday English'}).
Student Level: ${userLevel || 'Beginner'}.

RULES:
1. Keep your English reply simple, friendly, and under 25 words. Speak naturally using easy vocabulary.
2. Provide a clear, natural Malayalam translation or explanation of your reply so the student understands.
3. Suggest exactly 3 easy, practical English response options for the student to choose or speak.
4. If the student made a glaring grammatical error in their last message, gently include the correction inside the Malayalam explanation.
5. You MUST return ONLY valid JSON matching this structure:
{
  "reply": "English response sentence here",
  "malayalamExplanation": "മലയാളം തർജ്ജമ/വിശദീകരണം ഇവിടെ",
  "suggestedReplies": ["Option 1", "Option 2", "Option 3"]
}`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `Previous conversation:\n${conversationText}\n\nRespond as the conversation partner in JSON.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      reply: parsed.reply || "That's great! Tell me more about that.",
      malayalamExplanation: parsed.malayalamExplanation || "വളരെ നല്ലത്! അതിനെക്കുറിച്ച് കൂടുതൽ പറയാമോ?",
      suggestedReplies: parsed.suggestedReplies || [
        "Yes, I like it very much.",
        "Could you please repeat that?",
        "Thank you for helping me."
      ]
    });
  } catch (error: any) {
    console.error('Error in /api/ai/conversation:', error);
    return res.status(500).json({
      error: 'Failed to generate conversation response',
      fallback: {
        reply: "That is wonderful! How was your day today?",
        malayalamExplanation: "അത് കൊള്ളാം! ഇന്ന് നിങ്ങളുടെ ദിവസം എങ്ങനെ ഉണ്ടായിരുന്നു?",
        suggestedReplies: [
          "My day was very busy.",
          "It was a good day, thank you.",
          "I spent time studying English."
        ]
      }
    });
  }
});

// API: Speaking Arena Post-Practice Diagnostic Feedback
app.post('/api/ai/speaking-feedback', async (req, res) => {
  try {
    const { scenarioTitle, messages } = req.body;
    const ai = getAIClient();

    const studentUtterances = (messages || [])
      .filter((m: { sender: string }) => m.sender === 'user')
      .map((m: { text: string }) => m.text)
      .join(' | ');

    if (!ai) {
      return res.status(503).json({ error: 'AI feedback is temporarily unavailable. Please try again later.' });
    }
    if (!studentUtterances.trim()) {
      return res.status(400).json({ error: 'Complete a speaking turn before requesting feedback.' });
    }
    if (false) {
      return res.status(200).json({
        overallScore: 82,
        grammarFeedback: "Good attempt at basic sentence formation. Remember subject-verb agreement (e.g., 'He is', 'They are').",
        vocabularyFeedback: "Clear everyday words used correctly for this beginner scenario.",
        sentenceImprovement: "Try expanding one-word answers into complete short phrases.",
        fluencyTip: "Read aloud each sentence twice to build speech confidence.",
        malayalamSummary: "നല്ല തുടക്കമായിരുന്നു! ലളിതമായ പൂർണ്ണവാക്യങ്ങൾ നിർമ്മിക്കാൻ കൂടുതൽ പരിശീലിക്കുക.",
        suggestedPractice: [
          "I am learning to speak English fluently.",
          "I want to practice every day.",
          "Thank you for your help."
        ],
        transcriptionNote: "Evaluation is based on text transcription from your speech. Keep practicing clear pronunciation."
      });
    }

    const systemPrompt = `You are a diagnostic English speech evaluator for Malayalam beginners.
Analyze the student's transcribed responses in the speaking session: "${scenarioTitle}".
Student responses: ${studentUtterances}

CRITICAL RULES:
1. Be encouraging, supportive, and precise.
2. Note clearly that evaluation is based on text transcription rather than acoustic phonetics.
3. Provide realistic score out of 100 based on grammatical accuracy, relevance, and vocabulary.
4. Output concise bullet points in English, plus a warm summary in Malayalam (മലയാളത്തിൽ വിശദീകരണം).
5. Output ONLY valid JSON:
{
  "overallScore": number (50-100),
  "grammarFeedback": "short clear guidance on tense or pronoun usage",
  "vocabularyFeedback": "evaluation of words used",
  "sentenceImprovement": "one specific sentence the user said with its ideal form",
  "fluencyTip": "practical speaking practice tip",
  "malayalamSummary": "മലയാളത്തിൽ വിദ്യാർത്ഥിക്കുള്ള പ്രധാന വിലയിരുത്തലും പ്രോത്സാഹനവും",
  "suggestedPractice": ["Sentence 1", "Sentence 2", "Sentence 3"],
  "transcriptionNote": "Speech-to-text disclaimer note"
}`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `Evaluate the student's speaking practice transcript:\n${studentUtterances}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/speaking-feedback:', error);
    return res.status(502).json({ error: 'Speaking feedback could not be generated. Please retry.' });
    /*
    return res.status(500).json({
      overallScore: 80,
      grammarFeedback: "Good effort forming beginner sentences.",
      vocabularyFeedback: "Helpful daily vocabulary.",
      sentenceImprovement: "Practice connecting words with 'and', 'but', 'because'.",
      fluencyTip: "Repeat sentences aloud 3 times each morning.",
      malayalamSummary: "നല്ല മുന്നേറ്റം! ദിവസവും ചെറിയ വാക്യങ്ങൾ ഉറക്കെ വായിക്കുക.",
      suggestedPractice: [
        "I am practicing English today.",
        "It is nice to speak English."
      ],
      transcriptionNote: "Evaluation is based on speech transcription."
    });
    */
  }
});

// API: Writing Studio AI Evaluation & 100-Point Rubric
app.post('/api/ai/writing-feedback', async (req, res) => {
  try {
    const { activityTitle, promptText, userText, userLevel } = req.body;
    const ai = getAIClient();

    if (!userText || !userText.trim()) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Writing feedback is temporarily unavailable. Please try again later.' });
    }
    if (false) {
      // Disabled legacy fallback: never present a fabricated AI score.
      return res.status(200).json({
        score: 84,
        scoreBreakdown: {
          grammar: 26,
          vocabulary: 21,
          structure: 20,
          clarity: 17
        },
        originalSentence: userText,
        correctedSentence: userText.trim().replace(/^[a-z]/, (c: string) => c.toUpperCase()) + (userText.endsWith('.') ? '' : '.'),
        explanationMalayalam: "നിങ്ങളുടെ വാക്യം നന്നായിട്ടുണ്ട്! വലിയക്ഷരം (Capital letter) കൊണ്ടും ഫുൾസ്റ്റോപ്പ് കൊണ്ടും അവസാനിപ്പിക്കാൻ ശ്രദ്ധിക്കുക.",
        betterVocabulary: [
          { original: "good", better: "great", malayalam: "മികച്ച" },
          { original: "like", better: "enjoy", malayalam: "ആസ്വദിക്കുന്നു" }
        ],
        improvedVersion: "A polished, natural version of your sentence with smooth structure.",
        encouragement: "Very nice work! Keep practicing your daily writing."
      });
    }

    const systemPrompt = `You are a patient, expert English writing mentor for Malayalam-speaking beginners.
Task Title: "${activityTitle}"
Task Prompt: "${promptText}"
Student Level: "${userLevel || 'Beginner'}"

Evaluate the student's submission against this 100-point rubric:
1. Grammar & Mechanics (30 points max): Subject-verb agreement, tenses, capital letters, punctuation.
2. Vocabulary Choice (25 points max): Appropriate word usage for the level.
3. Sentence Structure (25 points max): Natural English word order (Subject-Verb-Object).
4. Clarity & Prompt Relevance (20 points max): Did they answer the prompt clearly?
Total Score = sum of all 4 (0 to 100).

CRITICAL REQUIREMENTS:
- Provide the exact corrected sentence with errors fixed.
- Provide a clear, simple explanation in Malayalam (മലയാളത്തിൽ എവിടെയാണ് തെറ്റ് പറ്റിയതെന്നും എങ്ങനെ ശരിയാക്കാമെന്നും വിശദീകരിക്കുക).
- Suggest 1-2 richer vocabulary words with their Malayalam meanings.
- Provide an improved, natural native version of the sentence.
- Return ONLY valid JSON:
{
  "score": number (0-100),
  "scoreBreakdown": {
    "grammar": number (0-30),
    "vocabulary": number (0-25),
    "structure": number (0-25),
    "clarity": number (0-20)
  },
  "originalSentence": string,
  "correctedSentence": string,
  "explanationMalayalam": string,
  "betterVocabulary": [
    { "original": string, "better": string, "malayalam": string }
  ],
  "improvedVersion": string,
  "encouragement": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Student writing submission:\n"${userText}"\n\nEvaluate and return structured JSON.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/writing-feedback:', error);
    return res.status(502).json({ error: 'Writing feedback could not be generated. Please retry.' });
    /*
    return res.status(500).json({
      score: 75,
      scoreBreakdown: { grammar: 22, vocabulary: 20, structure: 18, clarity: 15 },
      originalSentence: req.body.userText || '',
      correctedSentence: req.body.userText || '',
      explanationMalayalam: "വാക്യഘടന ശ്രദ്ധിക്കുക. ഓരോ ദിവസവും പുതിയ വാക്കുകൾ ചേർത്ത് എഴുതുക.",
      betterVocabulary: [],
      improvedVersion: req.body.userText || '',
      encouragement: "Good attempt! Keep practicing."
    });
    */
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ENGLISH QUEST server listening on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
