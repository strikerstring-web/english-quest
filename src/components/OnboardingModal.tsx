import React, { useState } from 'react';
import { UserProgress, Language, UserLevel, DailyGoal } from '../types';
import { Compass, Sparkles, Check, ArrowRight, BookOpen, Clock, Target } from 'lucide-react';

interface OnboardingModalProps {
  progress: UserProgress;
  isOpen: boolean;
  onComplete: (updatedProgress: Partial<UserProgress>) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  progress,
  isOpen,
  onComplete,
  onClose,
}) => {
  const [lang, setLang] = useState<Language>(progress.lang || 'en');
  const [name, setName] = useState<string>(progress.userName === 'English Learner' ? '' : progress.userName);
  const [level, setLevel] = useState<UserLevel>('Beginner 1 (Absolute)');
  const [goal, setGoal] = useState<DailyGoal>(progress.dailyGoalMinutes as DailyGoal || 15);
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const isMl = lang === 'ml';

  const handleFinish = () => {
    onComplete({
      userName: name.trim() || (isMl ? 'ഇംഗ്ലീഷ് പഠിതാവ്' : 'English Learner'),
      lang,
      dailyGoalMinutes: goal,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-pop">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#4F7CFF] via-[#8055E8] to-[#4F7CFF] p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">ENGLISH QUEST</h2>
          <p className="text-white/90 text-sm mt-1 font-medium font-malayalam">
            {isMl 
              ? 'മലയാളികൾക്കായുള്ള ലളിതമായ ഇംഗ്ലീഷ് പഠന ഗെയിം' 
              : 'Interactive English learning game for Malayalam beginners'}
          </p>

          {/* Language Toggle in Top Corner */}
          <div className="absolute top-4 right-4 flex items-center bg-white/20 backdrop-blur-md rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                lang === 'en' ? 'bg-white text-[#4F7CFF] shadow-sm' : 'text-white/90 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ml')}
              className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                lang === 'ml' ? 'bg-white text-[#4F7CFF] shadow-sm' : 'text-white/90 hover:text-white'
              }`}
            >
              മലയാളം
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {isMl ? 'നിങ്ങളുടെ പേര് നൽകുക' : 'What is your name?'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isMl ? 'ഉദാ: രാഹുൽ / അഞ്ജലി' : 'e.g. Rahul / Anjali'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {isMl ? 'നിങ്ങളുടെ നിലവിലെ ലെവൽ ഏതാണ്?' : 'Choose your current English level:'}
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'Beginner 1 (Absolute)' as UserLevel,
                      titleEn: 'Beginner 1: Absolute Beginner',
                      titleMl: 'ലെവൽ 1: ആദ്യം മുതൽ തുടങ്ങുന്നു (Alphabet & Basic Words)',
                      desc: isMl ? 'അക്ഷരങ്ങളും ലളിതമായ വാക്കുകളും പഠിക്കണം' : 'Starting from the very basics'
                    },
                    {
                      id: 'Beginner 2 (Basic Words)' as UserLevel,
                      titleEn: 'Beginner 2: Know Some Words',
                      titleMl: 'ലെവൽ 2: വാക്കുകൾ അറിയാം (Need Sentence Help)',
                      desc: isMl ? 'വാക്കുകൾ മനസ്സിലാകും, വാക്യങ്ങൾ ഉണ്ടാക്കാൻ പ്രയാസം' : 'Know some words but struggle to make sentences'
                    },
                    {
                      id: 'Beginner 3 (Short Sentences)' as UserLevel,
                      titleEn: 'Beginner 3: Want Speaking Practice',
                      titleMl: 'ലെവൽ 3: സംസാരിക്കാൻ മടി (Need Fluency)',
                      desc: isMl ? 'ഇംഗ്ലീഷ് വായിക്കാൻ അറിയാം, സംസാരിക്കാൻ പേടി' : 'Can read English, need confidence to speak'
                    }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setLevel(item.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                        level === item.id
                          ? 'border-[#4F7CFF] bg-blue-50/70 text-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">
                          {isMl ? item.titleMl : item.titleEn}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      {level === item.id && (
                        <div className="w-5 h-5 rounded-full bg-[#4F7CFF] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4F7CFF]/25 transition-all active:scale-[0.98]"
              >
                <span>{isMl ? 'അടുത്ത ഘട്ടം' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#4F7CFF]" />
                    {isMl ? 'ദിവസേനയുള്ള പഠന സമയം തിരഞ്ഞെടുക്കുക:' : 'Select your daily learning goal:'}
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { minutes: 5 as DailyGoal, title: 'Casual', ml: 'ലളിതം', xp: '15 XP/day' },
                    { minutes: 15 as DailyGoal, title: 'Regular', ml: 'സാധാരണ', xp: '35 XP/day' },
                    { minutes: 30 as DailyGoal, title: 'Serious', ml: 'തീവ്രം', xp: '75 XP/day' },
                  ].map((g) => (
                    <button
                      key={g.minutes}
                      onClick={() => setGoal(g.minutes)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        goal === g.minutes
                          ? 'border-[#8055E8] bg-purple-50 text-purple-900 shadow-sm ring-2 ring-[#8055E8]/30'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Clock className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
                      <div className="font-extrabold text-lg text-slate-900">{g.minutes}m</div>
                      <div className="text-xs font-medium text-slate-600 font-malayalam">
                        {isMl ? g.ml : g.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{g.xp}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* No registration reminder */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <p>
                  {isMl
                    ? 'രജിസ്ട്രേഷൻ ആവശ്യമില്ല! നിങ്ങളുടെ പുരോഗതി നിങ്ങളുടെ ഫോണിൽ/ബ്രൗസറിൽ തനിയെ സൂക്ഷിക്കപ്പെടും.'
                    : 'No registration needed! Your XP and streak will be safely saved in your browser.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 text-sm"
                >
                  {isMl ? 'പിന്നോട്ട്' : 'Back'}
                </button>
                <button
                  onClick={handleFinish}
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#8055E8] hover:opacity-95 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4F7CFF]/25 active:scale-[0.98]"
                >
                  <span>{isMl ? 'പഠനം ആരംഭിക്കാം!' : 'Start Learning!'}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
