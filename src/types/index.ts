export type Language = 'en' | 'ml';

export type UserLevel = 'Beginner 1 (Absolute)' | 'Beginner 2 (Basic Words)' | 'Beginner 3 (Short Sentences)' | 'Intermediate' | 'Advanced';

export type DailyGoal = 5 | 15 | 30; // minutes

export interface DailyMission {
  id: string;
  titleEn: string;
  titleMl: string;
  target: number;
  current: number;
  unit: string;
  xpReward: number;
  completed: boolean;
}

export interface WritingScoreEntry {
  id: string;
  date: string;
  activityTitle: string;
  score: number;
  text: string;
}

export interface SpeakingHistoryEntry {
  id: string;
  date: string;
  scenarioTitle: string;
  score: number;
  turnsCount: number;
}

export interface UserProgress {
  userName: string;
  selectedLevel?: UserLevel;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  dailyGoalMinutes: number;
  speakingMinutes: number;
  sentencesWritten: number;
  wordsLearned: string[]; // word IDs
  completedLessons: string[]; // lesson IDs
  unlockedStages: number; // 1 to 5
  stageMastery: Record<number, number>; // stageId -> score percentage
  achievements: string[]; // badge IDs
  lang: Language;
  hasCompletedOnboarding: boolean;
  writingHistory: WritingScoreEntry[];
  speakingHistory: SpeakingHistoryEntry[];
}

export interface VocabItem {
  id: string;
  level?: 'Intermediate' | 'Advanced';
  word: string;
  malayalam: string;
  phonetic: string;
  category: string;
  exampleEn: string;
  exampleMl: string;
  hint: string;
  emoji: string;
}

export type GrammarGameType = 'multiple_choice' | 'arrange_sentence' | 'find_mistake' | 'fill_blank';

export interface GrammarQuestion {
  id: string;
  topicId: string;
  type: GrammarGameType;
  promptEn: string;
  promptMl: string;
  options?: string[];
  correctAnswer: string;
  shuffledWords?: string[]; // for arrange_sentence
  sentenceWithMistake?: string; // for find_mistake
  explanationMl: string;
  explanationEn: string;
}

export interface GrammarTopic {
  id: string;
  level?: 'Intermediate' | 'Advanced';
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  rulesMl: string[];
  questions: GrammarQuestion[];
}


export interface SpeakingScenario {
  id: string;
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  partnerRoleEn: string;
  partnerRoleMl: string;
  starterMessageEn: string;
  starterMessageMl: string;
  suggestedStarters: string[];
  emoji: string;
}

export interface WritingPrompt {
  id: string;
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  starterSentenceEn?: string;
  starterSentenceMl?: string;
  suggestedKeywords: Array<{ en: string; ml: string }>;
  minWords: number;
  targetWords: number;
  malayalamGuidance: string;
}

export interface AchievementBadge {
  id: string;
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  icon: string;
  unlocked: boolean;
}
