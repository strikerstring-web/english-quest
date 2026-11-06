import React, { useState } from 'react';
import { UserProgress } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/achievements';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { resetAllProgress } from '../utils/storage';
import { speakText } from '../utils/speech';
import { 
  User, 
  Flame, 
  Zap, 
  Coins, 
  Award, 
  BookOpen, 
  Mic, 
  PenTool, 
  RotateCcw, 
  Trash2, 
  Check, 
  Sparkles,
  Volume2,
  Calendar,
  Lock
} from 'lucide-react';

interface ProfileViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onOpenOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  progress,
  onUpdateProgress,
  onOpenOnboarding,
}) => {
  const isMl = progress.lang === 'ml';

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(progress.userName);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'words' | 'speaking' | 'writing'>('achievements');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    onUpdateProgress((prev) => ({
      ...prev,
      userName: nameInput.trim()
    }));
    setIsEditingName(false);
  };

  const handleConfirmReset = () => {
    const fresh = resetAllProgress();
    onUpdateProgress(() => fresh);
    setShowResetModal(false);
  };

  const handlePlayWord = (word: string, id: string) => {
    setPlayingAudioId(id);
    speakText(word, 'en-US', () => setPlayingAudioId(null));
  };

  // Compute unlocked status for badges
  const computedBadges = ACHIEVEMENT_BADGES.map((b) => {
    let unlocked = false;
    if (b.id === 'first_words' && progress.wordsLearned.length >= 5) unlocked = true;
    if (b.id === 'vocab_champion' && progress.wordsLearned.length >= 20) unlocked = true;
    if (b.id === 'grammar_guru' && progress.completedLessons.filter((l) => l.startsWith('grammar_')).length >= 3) unlocked = true;
    if (b.id === 'speaker_bronze' && progress.speakingHistory.length >= 1) unlocked = true;
    if (b.id === 'writer_ace' && progress.writingHistory.some((w) => w.score >= 80)) unlocked = true;
    if (b.id === 'stage_1_done' && (progress.stageMastery[1] || 0) >= 70) unlocked = true;
    if (b.id === 'streak_3' && progress.streak >= 3) unlocked = true;
    if (b.id === 'bilingual_bridge' && progress.xp >= 250) unlocked = true;
    return { ...b, unlocked };
  });

  const learnedVocabItems = VOCABULARY_LIST.filter((v) => progress.wordsLearned.includes(v.id));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#4F7CFF] to-[#8055E8] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#4F7CFF]/25 shrink-0">
            {progress.userName ? progress.userName.charAt(0).toUpperCase() : 'E'}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">
                    {progress.userName}
                  </h1>
                  <button
                    onClick={() => {
                      setNameInput(progress.userName);
                      setIsEditingName(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F7CFF] border border-blue-200 text-xs font-bold">
                Level {progress.level}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-malayalam">
              {isMl
                ? 'നിങ്ങളുടെ ഇംഗ്ലീഷ് പഠന പുരോഗതിയും നേടിയ ബാഡ്ജുകളും ഇവിടെ കാണാം'
                : 'Track your XP, streak, speaking history, writing scores, and learned vocabulary.'}
            </p>

            {/* Quick Pill Stats */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="tabular-nums">{progress.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#4F7CFF] font-bold border border-blue-200">
                <Zap className="w-4 h-4 text-[#4F7CFF] fill-[#4F7CFF]" />
                <span className="tabular-nums">{progress.xp} Total XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="tabular-nums">{progress.coins} Coins</span>
              </div>
            </div>
          </div>

          {/* Edit Goals / Preferences Button */}
          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shrink-0"
          >
            {isMl ? 'ലക്ഷ്യങ്ങൾ മാറ്റുക' : 'Change Goal / Level'}
          </button>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'achievements' as const, labelEn: 'Achievements', labelMl: 'നേട്ടങ്ങൾ (Badges)', icon: Award, count: computedBadges.filter(b => b.unlocked).length },
          { id: 'words' as const, labelEn: 'Vocabulary', labelMl: 'പഠിച്ച വാക്കുകൾ', icon: BookOpen, count: progress.wordsLearned.length },
          { id: 'speaking' as const, labelEn: 'Speaking Log', labelMl: 'സംസാര രേഖ', icon: Mic, count: progress.speakingHistory.length },
          { id: 'writing' as const, labelEn: 'Writing Scores', labelMl: 'എഴുത്ത് സ്കോർ', icon: PenTool, count: progress.writingHistory.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className={isMl ? 'font-malayalam' : ''}>
                {isMl ? tab.labelMl : tab.labelEn}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACHIEVEMENTS GALLERY */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          {computedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all space-y-2 text-center relative ${
                badge.unlocked
                  ? 'border-amber-200 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xs bg-white border border-slate-100">
                {badge.icon}
              </div>

              <div className="font-extrabold text-sm text-slate-900 pt-1">
                {isMl ? badge.titleMl : badge.titleEn}
              </div>

              <p className="text-xs text-slate-500 font-malayalam leading-relaxed">
                {isMl ? badge.descriptionMl : badge.descriptionEn}
              </p>

              <div className="pt-2">
                {badge.unlocked ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Unlocked ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center gap-1 w-fit mx-auto">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: VOCABULARY LEARNED LIST */}
      {activeTab === 'words' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              {isMl ? 'നിങ്ങൾ പഠിച്ച വാക്കുകൾ' : 'Mastered Vocabulary Words'}
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {learnedVocabItems.length} words learned
            </span>
          </div>

          {learnedVocabItems.length === 0 ? (
            <p className="text-xs text-slate-400 font-malayalam py-6 text-center">
              {isMl
                ? 'നിങ്ങൾ ഇതുവരെ വാക്കുകൾ പഠിച്ചിട്ടില്ല. വൊക്കാബുലറി ഗെയിമുകൾ കളിച്ച് പുതിയ വാക്കുകൾ പഠിക്കൂ!'
                : 'No words learned yet. Play vocabulary games to start adding words to your shelf!'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {learnedVocabItems.map((vocab) => (
                <div
                  key={vocab.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{vocab.emoji}</span>
                      <span className="font-bold text-slate-900 text-sm">{vocab.word}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-malayalam">
                      {vocab.malayalam}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlayWord(vocab.word, vocab.id)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#4F7CFF] flex items-center justify-center shrink-0 hover:bg-blue-50"
                  >
                    <Volume2 className={`w-4 h-4 ${playingAudioId === vocab.id ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPEAKING PRACTICE HISTORY */}
      {activeTab === 'speaking' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-slate-900 text-base">
            {isMl ? 'സംസാര പരിശീലന ചരിത്രം' : 'Speaking Practice Sessions'}
          </h3>

          {progress.speakingHistory.length === 0 ? (
            <p className="text-xs text-slate-400 font-malayalam py-6 text-center">
              {isMl
                ? 'സംഭാഷണ പരിശീലന രേഖകളൊന്നുമില്ല. സ്പീക്കിംഗ് അരീനയിൽ ആദ്യ സംഭാഷണം തുടങ്ങൂ!'
                : 'No speaking sessions completed yet. Head to Speaking Arena to practice with AI!'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {progress.speakingHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4F7CFF] flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.scenarioTitle}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {item.date} · {item.turnsCount} turns
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-[#4F7CFF] tabular-nums">
                      {item.score}/100
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WRITING SCORES HISTORY */}
      {activeTab === 'writing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-slate-900 text-base">
            {isMl ? 'എഴുത്തു പരീക്ഷണ സ്കോറുകൾ' : 'Writing Submissions & Scores'}
          </h3>

          {progress.writingHistory.length === 0 ? (
            <p className="text-xs text-slate-400 font-malayalam py-6 text-center">
              {isMl
                ? 'എഴുത്തു പരീക്ഷണ രേഖകളൊന്നുമില്ല. റൈറ്റിംഗ് സ്റ്റുഡിയോയിൽ ആദ്യ വാക്യം എഴുതി സ്കോർ നേടൂ!'
                : 'No writing submissions yet. Head to Writing Studio to practice sentence building!'}
            </p>
          ) : (
            <div className="space-y-3">
              {progress.writingHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#8055E8]" />
                      <span className="font-bold text-slate-900 text-sm">{item.activityTitle}</span>
                    </div>
                    <span className="font-black text-sm text-[#8055E8] tabular-nums">
                      {item.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                    "{item.text}"
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block text-right">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Danger Zone: Reset Progress with Confirmation */}
      <div className="p-6 rounded-3xl bg-red-50/50 border border-red-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-red-900 text-sm">
              {isMl ? 'പുരോഗതി പൂർണ്ണമായി പുനഃക്രമീകരിക്കുക (Reset Progress)' : 'Reset All Progress'}
            </h4>
            <p className="text-xs text-red-700/80 font-malayalam mt-0.5">
              {isMl
                ? 'ഇതുവരെ നേടിയ XP, ലെവലുകൾ, സ്ട്രീക്ക് എന്നിവ ഒഴിവാക്കി തുടക്കം മുതൽ വീണ്ടും തുടങ്ങാൻ'
                : 'Wipe all earned XP, streaks, completed missions, and start afresh.'}
            </p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isMl ? 'റീസെറ്റ് ചെയ്യുക' : 'Reset All'}</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 border border-slate-100 text-center animate-pop">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {isMl ? 'തീർച്ചയാണോ? പുരോഗതി നഷ്ടപ്പെടും' : 'Are you sure?'}
            </h3>

            <p className="text-xs text-slate-600 font-malayalam leading-relaxed">
              {isMl
                ? 'നിങ്ങളുടെ ലെവൽ, XP, ബാഡ്ജുകൾ എന്നിവയെല്ലാം പൂർണ്ണമായി മായ്ക്കപ്പെടും. ഈ പ്രവർത്തനം പിൻവലിക്കാൻ കഴിയില്ല.'
                : 'All your XP, completed lessons, streaks, and saved writing scores will be permanently reset.'}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 text-xs hover:bg-slate-50"
              >
                {isMl ? 'റദ്ദാക്കുക' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReset}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                {isMl ? 'അതെ, റീസെറ്റ് ചെയ്യൂ' : 'Yes, Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
