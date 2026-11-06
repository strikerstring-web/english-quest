import { UserProgress, DailyMission } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'english_quest_user_progress_v1';

export const DEFAULT_USER_PROGRESS: UserProgress = {
  userName: 'English Learner',
  level: 1,
  xp: 40,
  coins: 50,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalMinutes: 15,
  speakingMinutes: 0,
  sentencesWritten: 0,
  wordsLearned: ['v1', 'v2'],
  completedLessons: [],
  unlockedStages: 1,
  stageMastery: { 1: 0 },
  achievements: [],
  lang: 'en',
  hasCompletedOnboarding: false,
  writingHistory: [],
  speakingHistory: []
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_USER_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROGRESS;
    const parsed = JSON.parse(raw);

    // Check and update daily streak
    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = parsed.lastActiveDate || todayStr;

    if (lastActive !== todayStr) {
      const todayDate = new Date(todayStr);
      const lastDate = new Date(lastActive);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Continuous streak
        parsed.streak = (parsed.streak || 0) + 1;
      } else if (diffDays > 1) {
        // Missed one or more days
        parsed.streak = 1;
      }
      parsed.lastActiveDate = todayStr;
      // Reset daily counts
      parsed.speakingMinutes = 0;
      parsed.sentencesWritten = 0;
      saveUserProgress(parsed);
    }

    return {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
      stageMastery: parsed.stageMastery || { 1: 0 }
    };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export function calculateLevel(xp: number): number {
  // 100 XP per level
  return Math.floor(xp / 100) + 1;
}

export function triggerRewardEffect(isLevelUp: boolean = false) {
  try {
    if (isLevelUp) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4F7CFF', '#8055E8', '#37D6A0', '#F59E0B']
      });
    } else {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#37D6A0', '#4F7CFF']
      });
    }
  } catch (e) {
    // ignore
  }
}

export function getDailyMissions(progress: UserProgress): DailyMission[] {
  const wordsCount = progress.wordsLearned.length;
  const speakingMins = progress.speakingMinutes;
  const sentencesCount = progress.sentencesWritten;
  const grammarGamesDone = progress.completedLessons.filter((l) => l.startsWith('grammar_')).length;

  return [
    {
      id: 'm1',
      titleEn: 'Learn 5 new English words',
      titleMl: '5 പുതിയ ഇംഗ്ലീഷ് വാക്കുകൾ പഠിക്കുക',
      target: 5,
      current: Math.min(5, wordsCount),
      unit: 'words',
      xpReward: 25,
      completed: wordsCount >= 5
    },
    {
      id: 'm2',
      titleEn: 'Complete 1 grammar game',
      titleMl: '1 ഗ്രാമർ ഗെയിം പൂർത്തിയാക്കുക',
      target: 1,
      current: Math.min(1, grammarGamesDone),
      unit: 'game',
      xpReward: 20,
      completed: grammarGamesDone >= 1
    },
    {
      id: 'm3',
      titleEn: 'Practice speaking for 2 minutes',
      titleMl: '2 മിനിറ്റ് ഇംഗ്ലീഷ് സംസാരിക്കാൻ പരിശീലിക്കുക',
      target: 2,
      current: Math.min(2, speakingMins),
      unit: 'mins',
      xpReward: 30,
      completed: speakingMins >= 2
    },
    {
      id: 'm4',
      titleEn: 'Write 3 English sentences',
      titleMl: '3 ഇംഗ്ലീഷ് വാക്യങ്ങൾ എഴുതുക',
      target: 3,
      current: Math.min(3, sentencesCount),
      unit: 'sentences',
      xpReward: 25,
      completed: sentencesCount >= 3
    }
  ];
}

export function resetAllProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { ...DEFAULT_USER_PROGRESS };
}
