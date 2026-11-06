import React from 'react';
import { UserProgress, DailyMission } from '../types';
import { getDailyMissions, triggerRewardEffect } from '../utils/storage';
import { 
  Flame, 
  Zap, 
  Target, 
  Mic, 
  PenTool, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Gamepad2, 
  BookOpen, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface HomeViewProps {
  progress: UserProgress;
  onNavigate: (section: string) => void;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  onNavigate,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';
  const missions = getDailyMissions(progress);

  const completedMissionsCount = missions.filter((m) => m.completed).length;
  const xpInCurrentLevel = progress.xp % 100;
  const nextLevelXP = 100;

  // Claim mission XP if not already claimed
  const handleClaimMission = (mission: DailyMission) => {
    if (!mission.completed) return;
    const missionClaimId = `claimed_${mission.id}_${new Date().toISOString().split('T')[0]}`;
    if (progress.completedLessons.includes(missionClaimId)) return;

    triggerRewardEffect(false);
    onUpdateProgress((prev) => {
      const newXp = prev.xp + mission.xpReward;
      const newLevel = Math.floor(newXp / 100) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        coins: prev.coins + 10,
        completedLessons: [...prev.completedLessons, missionClaimId]
      };
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMl ? 'ഇന്നത്തെ ഇംഗ്ലീഷ് ക്വസ്റ്റ്' : "Today's Quest"}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isMl ? `നമസ്കാരം, ${progress.userName}!` : `Hello, ${progress.userName}!`}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-malayalam">
              {isMl
                ? 'ദിവസവും കുറച്ചുനേരം സംസാരിക്കുകയും എഴുതുകയും ചെയ്യുമ്പോൾ ഇംഗ്ലീഷ് വളരെ എളുപ്പമാകും. ഇന്നത്തെ പാഠം പൂർത്തിയാക്കൂ!'
                : 'Consistent daily practice makes English easy and natural. Complete your daily missions to earn XP and level up!'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('speaking')}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
              >
                <Mic className="w-4 h-4 text-[#37D6A0]" />
                <span>{isMl ? 'സംസാരിച്ചു നോക്കൂ' : 'AI Speaking Arena'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pillar */}
          <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex md:flex-col gap-4 justify-between sm:min-w-[200px]">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isMl ? 'നിലവിലെ ലെവൽ' : 'Current Level'}
              </div>
              <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>Lv {progress.level}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#4F7CFF]/30 text-[#4F7CFF] border border-[#4F7CFF]/40">
                  {isMl ? (progress.selectedLevel || 'തുടക്കക്കാരൻ') : (progress.selectedLevel || 'Beginner')}
                </span>
              </div>
              {/* Progress bar to next level */}
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#4F7CFF] to-[#37D6A0] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, xpInCurrentLevel))}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {xpInCurrentLevel} / {nextLevelXP} XP
              </div>
            </div>

            <div className="border-l md:border-l-0 md:border-t border-white/10 pl-4 md:pl-0 md:pt-3">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{isMl ? 'തുടർച്ചയായ പഠനം' : 'Daily Streak'}</span>
              </div>
              <div className="text-xl font-bold text-amber-400 mt-0.5 tabular-nums">
                {progress.streak} {isMl ? 'ദിവസങ്ങൾ' : 'Days'} 🔥
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#4F7CFF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#8055E8]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Progress Cards: Speaking, Writing & Daily Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Speaking Progress */}
        <div 
          onClick={() => onNavigate('speaking')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4F7CFF]/50 shadow-sm transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4F7CFF] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
              {progress.speakingMinutes} min
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isMl ? 'സംസാര പരിശീലനം' : 'Speaking Practice'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-malayalam line-clamp-2">
            {isMl
              ? '7 നിത്യജീവിത സാഹചര്യങ്ങളിൽ AI പങ്കാളിയുമായി സംസാരിക്കുക'
              : 'Interactive real-life roleplays with AI voice feedback'}
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-[#4F7CFF] group-hover:translate-x-0.5 transition-transform">
            <span>{isMl ? 'പരിശീലിക്കാൻ തുടങ്ങൂ' : 'Open Arena'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Writing Progress */}
        <div 
          onClick={() => onNavigate('writing')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#8055E8]/50 shadow-sm transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8055E8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
              {progress.sentencesWritten} {isMl ? 'വാക്യങ്ങൾ' : 'sentences'}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isMl ? 'എഴുത്തു സ്റ്റുഡിയോ' : 'Writing Studio'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-malayalam line-clamp-2">
            {isMl
              ? 'ലളിതമായ വാക്യങ്ങൾ എഴുതി 100-ൽ സ്കോറും മലയാള വിശദീകരണവും നേടുക'
              : 'Sentence writing with 100-pt AI rubric & Malayalam tips'}
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-[#8055E8] group-hover:translate-x-0.5 transition-transform">
            <span>{isMl ? 'എഴുതി നോക്കൂ' : 'Write Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Vocabulary practice */}
        <button onClick={() => onNavigate('games')} className="text-left p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-sm transition-all group hover:shadow-md">
          <div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><BookOpen className="w-5 h-5" /></div><span className="text-xs font-semibold text-slate-500">{progress.wordsLearned.length} {isMl ? 'വാക്കുകൾ' : 'words learned'}</span></div>
          <h3 className="font-bold text-slate-900">{isMl ? 'പദസമ്പത്ത്' : 'Vocabulary'}</h3><p className="text-xs text-slate-500 mt-1">{isMl ? 'പുതിയ വാക്കുകളും അർത്ഥങ്ങളും പഠിക്കുക' : 'Learn words, meanings and pronunciation'}</p><div className="mt-4 text-xs font-bold text-emerald-600">{isMl ? 'പഠിക്കാം' : 'Practice now'} →</div>
        </button>
        {/* Grammar practice */}
        <button onClick={() => onNavigate('games')} className="text-left p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 shadow-sm transition-all group hover:shadow-md">
          <div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Gamepad2 className="w-5 h-5" /></div><span className="text-xs font-semibold text-slate-500">{progress.completedLessons.filter((item) => item.startsWith('grammar_')).length} {isMl ? 'വിഷയങ്ങൾ' : 'topics done'}</span></div>
          <h3 className="font-bold text-slate-900">{isMl ? 'ഗ്രാമർ പരിശീലനം' : 'Grammar Games'}</h3><p className="text-xs text-slate-500 mt-1">{isMl ? 'വ്യാകരണം ചോദ്യങ്ങളിലൂടെ പഠിക്കുക' : 'Build sentences and practise grammar rules'}</p><div className="mt-4 text-xs font-bold text-amber-600">{isMl ? 'പരിശീലിക്കാം' : 'Practice now'} →</div>
        </button>

        {/* Daily Learning Goal */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#37D6A0] flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {progress.dailyGoalMinutes} min / day
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isMl ? 'ദിവസേനയുള്ള ലക്ഷ്യം' : 'Daily Goal'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-malayalam">
            {isMl
              ? `${completedMissionsCount}/4 ദൗത്യങ്ങൾ ഇന്ന് പൂർത്തിയായി`
              : `${completedMissionsCount} of 4 missions completed today`}
          </p>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedMissionsCount / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Missions Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{isMl ? 'ഇന്നത്തെ ദൗത്യങ്ങൾ (Daily Missions)' : 'Daily Missions'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-malayalam mt-0.5">
              {isMl
                ? 'ഓരോ ദൗത്യവും പൂർത്തിയാക്കുമ്പോൾ കൂടുതൽ XP പോയിന്റുകൾ ലഭിക്കുന്നു'
                : 'Complete these quests to build steady momentum and earn extra XP'}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {completedMissionsCount} / {missions.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {missions.map((mission) => {
            const isClaimed = progress.completedLessons.includes(
              `claimed_${mission.id}_${new Date().toISOString().split('T')[0]}`
            );
            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  mission.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-900'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {mission.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isMl ? mission.titleMl : mission.titleEn}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>
                        {mission.current} / {mission.target} {mission.unit}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-[#4F7CFF] flex items-center gap-0.5">
                        <Zap className="w-3 h-3 fill-[#4F7CFF]" />
                        +{mission.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                {mission.completed && !isClaimed && (
                  <button
                    onClick={() => handleClaimMission(mission)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all shrink-0 animate-bounce"
                  >
                    {isMl ? 'XP നേടൂ' : 'Claim XP'}
                  </button>
                )}
                {isClaimed && (
                  <span className="text-xs font-bold text-emerald-700 shrink-0">
                    {isMl ? 'ലഭിച്ചു ✓' : 'Claimed ✓'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Hub: Quick Jump to Learning Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vocabulary Quest Banner */}
        <div 
          onClick={() => onNavigate('games')}
          className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg cursor-pointer group hover:scale-[1.01] transition-transform relative overflow-hidden"
        >
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {isMl ? 'പദസമ്പത്ത് ഗെയിമുകൾ' : 'Vocabulary Game'}
            </span>
            <h3 className="text-xl font-black">
              {isMl ? '50+ പുതിയ വാക്കുകൾ പഠിക്കാം' : 'Master 50+ Essential Words'}
            </h3>
            <p className="text-white/80 text-xs font-malayalam max-w-sm">
              {isMl
                ? 'ശരിയായ അർത്ഥം കണ്ടെത്തുക, അക്ഷരങ്ങൾ പൂരിപ്പിക്കുക, ചിത്രങ്ങൾ പൊരുത്തപ്പെടുത്തുക'
                : 'Meaning quiz, word matching tiles, missing letters, and audio listening challenges.'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-extrabold text-white group-hover:translate-x-1 transition-transform">
              <span>{isMl ? 'ഗെയിം കളിക്കാം' : 'Play Vocab Games'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>
    </div>
  );
};
