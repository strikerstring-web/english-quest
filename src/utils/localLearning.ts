import { WritingPrompt, UserLevel } from '../types';

export interface LocalWritingFeedback {
  score: number;
  scoreBreakdown: { grammar: number; vocabulary: number; structure: number; clarity: number };
  originalSentence: string;
  correctedSentence: string;
  explanationMalayalam: string;
  betterVocabulary: Array<{ original: string; better: string; malayalam: string }>;
  improvedVersion: string;
  encouragement: string;
}

const replacements: Array<[RegExp, string, string]> = [
  [/\bi am go to\b/gi, 'I am going to', '“am going to” ഉപയോഗിക്കുമ്പോൾ verb-ന്റെ -ing രൂപം ഉപയോഗിക്കുക.'],
  [/\bhe go to\b/gi, 'he goes to', 'He/She/It ഉപയോഗിക്കുമ്പോൾ Simple Present-ൽ സാധാരണ verb-ന് -s ചേർക്കണം.'],
  [/\bshe go to\b/gi, 'she goes to', 'He/She/It ഉപയോഗിക്കുമ്പോൾ Simple Present-ൽ സാധാരണ verb-ന് -s ചേർക്കണം.'],
  [/\bi has\b/gi, 'I have', 'I എന്ന subject-നൊപ്പം have ആണ് ഉപയോഗിക്കുന്നത്.'],
  [/\bhe have\b/gi, 'he has', 'He എന്ന subject-നൊപ്പം has ആണ് ഉപയോഗിക്കുന്നത്.'],
  [/\bshe have\b/gi, 'she has', 'She എന്ന subject-നൊപ്പം has ആണ് ഉപയോഗിക്കുന്നത്.'],
  [/\bthey is\b/gi, 'they are', 'They എന്ന subject-നൊപ്പം are ഉപയോഗിക്കുക.'],
  [/\bwe is\b/gi, 'we are', 'We എന്ന subject-നൊപ്പം are ഉപയോഗിക്കുക.'],
  [/\byou is\b/gi, 'you are', 'You എന്ന subject-നൊപ്പം are ഉപയോഗിക്കുക.'],
  [/\bhe are\b/gi, 'he is', 'He എന്ന subject-നൊപ്പം is ഉപയോഗിക്കുക.'],
  [/\bshe are\b/gi, 'she is', 'She എന്ന subject-നൊപ്പം is ഉപയോഗിക്കുക.'],
  [/\bi goes\b/gi, 'I go', 'I എന്ന subject-നൊപ്പം base verb ഉപയോഗിക്കുക.'],
  [/\bdoes not goes\b/gi, 'does not go', 'Does not-ന് ശേഷം base verb ഉപയോഗിക്കുക.']
];

const vocabularyUpgrades: Record<string, { better: string; malayalam: string }> = {
  good: { better: 'excellent', malayalam: 'മികച്ചത്' },
  bad: { better: 'unpleasant', malayalam: 'അസുഖകരമായ' },
  very: { better: 'particularly', malayalam: 'പ്രത്യേകിച്ച്' },
  big: { better: 'enormous', malayalam: 'വളരെ വലുതായ' },
  small: { better: 'tiny', malayalam: 'വളരെ ചെറുതായ' },
  happy: { better: 'delighted', malayalam: 'അതിയായ സന്തോഷമുള്ള' },
  sad: { better: 'upset', malayalam: 'വിഷമിച്ച' },
  nice: { better: 'pleasant', malayalam: 'ആനന്ദകരമായ' },
  important: { better: 'essential', malayalam: 'അത്യാവശ്യമായ' },
  interesting: { better: 'fascinating', malayalam: 'വളരെ ആകർഷകമായ' }
};

export function evaluateWritingLocally(text: string, prompt: WritingPrompt, _level: UserLevel | string): LocalWritingFeedback {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const normalized = words.map((word) => word.toLowerCase().replace(/[^a-z']/g, ''));
  const unique = new Set(normalized.filter(Boolean));
  const sentences = text.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
  const corrected = replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\bi\b/g, 'I').replace(/\s+/g, ' ').trim()
    .replace(/^([a-z])/, (letter) => letter.toUpperCase());
  const correctedSentence = /[.!?]$/.test(corrected) ? corrected : `${corrected}.`;
  const grammarSignals = (text.match(/\b(am|is|are|was|were|has|have|had|do|does|did|will|can|could|because|although|but|and)\b/gi) || []).length;
  const grammar = Math.min(30, Math.max(12, 17 + Math.min(grammarSignals, 7) + (replacements.some(([pattern]) => pattern.test(text)) ? -2 : 3)));
  const vocabulary = Math.min(25, Math.max(10, 10 + Math.min(unique.size, 12) + (unique.size / Math.max(words.length, 1) > 0.65 ? 2 : 0)));
  const structure = Math.min(25, Math.max(8, 10 + Math.min(sentences.length * 3, 9) + (words.length >= prompt.minWords ? 4 : 0)));
  const relevance = prompt.suggestedKeywords.some((keyword) => normalized.includes(keyword.en.toLowerCase())) ? 4 : 0;
  const clarity = Math.min(20, Math.max(8, 10 + (words.length >= prompt.minWords ? 5 : 0) + relevance + (sentences.length > 0 ? 1 : 0)));
  const score = Math.min(100, grammar + vocabulary + structure + clarity);
  const betterVocabulary = Object.entries(vocabularyUpgrades).filter(([word]) => normalized.includes(word)).slice(0, 4).map(([original, value]) => ({ original, ...value }));
  const issues = replacements.filter(([pattern]) => pattern.test(text)).map(([, , explanation]) => explanation);
  const explanationMalayalam = issues.length ? issues.join(' ') : 'നിങ്ങളുടെ എഴുത്ത് വായിക്കാവുന്നതാണ്. കൂടുതൽ സ്വാഭാവികമാക്കാൻ subject–verb agreement, tense, പുതിയ പദങ്ങൾ, വാക്യങ്ങൾ തമ്മിലുള്ള ബന്ധം എന്നിവ ശ്രദ്ധിക്കുക. Capital letters, full stop, punctuation എന്നിവയ്ക്ക് ഈ സ്കോറിൽ മാർക്ക് കുറയ്ക്കില്ല.';
  const encouragement = score >= 80 ? 'Excellent effort! Keep expressing your ideas with more detail.' : score >= 60 ? 'Good progress! Review the suggestions and try adding more detail.' : 'A useful start. Try writing two or three complete sentences and practise again.';
  return { score, scoreBreakdown: { grammar, vocabulary, structure, clarity }, originalSentence: text, correctedSentence, explanationMalayalam, betterVocabulary, improvedVersion: correctedSentence, encouragement };
}
