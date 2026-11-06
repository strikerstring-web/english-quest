import React, { useState } from 'react';
import { UserProgress, LearningStage, StageLesson } from '../types';
import { LEARNING_STAGES } from '../data/stages';
import { speakText } from '../utils/speech';
import { triggerRewardEffect } from '../utils/storage';
import { 
  Lock, 
  CheckCircle2, 
  Play, 
  Volume2, 
  HelpCircle, 
  Sparkles, 
  Award, 
  ArrowRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface LearnViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onNavigate: (section: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigate,
}) => {
  const isMl = progress.lang === 'ml';

  const [selectedStageId, setSelectedStageId] = useState<number>(progress.unlockedStages || 1);
  const [activeLesson, setActiveLesson] = useState<StageLesson | null>(null);
  
  // Quiz state
  const [inQuizMode, setInQuizMode] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  const selectedStage = LEARNING_STAGES.find((s) => s.id === selectedStageId) || LEARNING_STAGES[0];

  const handlePlayAudio = (text: string, id: string) => {
    setAudioPlaying(id);
    speakText(text, 'en-US', () => setAudioPlaying(null));
  };

  const handleStartQuiz = (lesson: StageLesson) => {
    setActiveLesson(lesson);
    setInQuizMode(true);
    setQuizQuestionIndex(0);
    setSelectedAnswers({});
    setShowQuizResult(false);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[quizQuestionIndex] !== undefined) return;
    setSelectedAnswers({ ...selectedAnswers, [quizQuestionIndex]: optionIdx });
  };

  const handleNextQuizQuestion = () => {
    if (!activeLesson) return;
    if (quizQuestionIndex < activeLesson.quiz.length - 1) {
      setQuizQuestionIndex(quizQuestionIndex + 1);
    } else {
      // Calculate Quiz Result
      setShowQuizResult(true);
      let correctCount = 0;
      activeLesson.quiz.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / activeLesson.quiz.length) * 100);

      // Save lesson completion
      const lessonKey = `stage_${selectedStage.id}_${activeLesson.id}`;
      const isPassed = scorePct >= 70;

      if (isPassed) {
        triggerRewardEffect(true);
      }

      onUpdateProgress((prev) => {
        const isNewCompletion = !prev.completedLessons.includes(lessonKey);
        const updatedCompleted = isNewCompletion
          ? [...prev.completedLessons, lessonKey]
          : prev.completedLessons;

        // If score is good and on the edge of current stage, potentially unlock next stage
        let nextUnlocked = prev.unlockedStages;
        if (isPassed && selectedStage.id === prev.unlockedStages && prev.unlockedStages < 5) {
          nextUnlocked = prev.unlockedStages + 1;
        }

        const newXp = prev.xp + (isPassed ? 40 : 15);
        const newLevel = Math.floor(newXp / 100) + 1;

        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          coins: prev.coins + (isPassed ? 15 : 5),
          completedLessons: updatedCompleted,
          unlockedStages: nextUnlocked,
          stageMastery: {
            ...prev.stageMastery,
            [selectedStage.id]: Math.max(prev.stageMastery[selectedStage.id] || 0, scorePct)
          }
        };
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F7CFF] bg-blue-50 px-2.5 py-1 rounded-lg">
            {isMl ? '5 ഘട്ടങ്ങളായുള്ള പഠന പാത' : '5-Stage Beginner Path'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            {isMl ? 'ഇംഗ്ലീഷ് പഠന പാത (Learn Path)' : 'English Learning Path'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-malayalam mt-1">
            {isMl
              ? 'ഓരോ ഘട്ടത്തിലെയും ക്വിസ്സിൽ 70% സ്കോർ നേടി അടുത്ത ഘട്ടം അൺലോക്ക് ചെയ്യുക'
              : 'Complete lessons and score 70%+ in the mastery quiz to unlock the next stage.'}
          </p>
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shrink-0">
          <Award className="w-5 h-5 text-[#8055E8]" />
          <div className="text-left text-xs">
            <div className="text-slate-500 font-medium">
              {isMl ? 'തുറന്ന ഘട്ടങ്ങൾ' : 'Unlocked Stages'}
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {progress.unlockedStages} / 5
            </div>
          </div>
        </div>
      </div>

      {/* Stage Selection Horizontal Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {LEARNING_STAGES.map((stage) => {
          const isUnlocked = stage.id <= progress.unlockedStages;
          const isSelected = stage.id === selectedStageId;
          const mastery = progress.stageMastery[stage.id] || 0;

          return (
            <button
              key={stage.id}
              disabled={!isUnlocked}
              onClick={() => {
                setSelectedStageId(stage.id);
                setActiveLesson(null);
                setInQuizMode(false);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-[#4F7CFF] bg-blue-50/80 shadow-md ring-2 ring-[#4F7CFF]/20'
                  : isUnlocked
                  ? 'border-slate-200 bg-white hover:border-slate-300'
                  : 'border-slate-200/60 bg-slate-100/70 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">
                  {stage.id}
                </span>
                {isUnlocked ? (
                  mastery >= 70 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#4F7CFF]" />
                  )
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <div className="text-xs font-extrabold text-slate-900 truncate">
                {isMl ? `ഘട്ടം ${stage.id}` : `Stage ${stage.id}`}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                {stage.titleEn.split(':')[1]?.trim() || stage.titleEn}
              </div>

              {isUnlocked && mastery > 0 && (
                <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                  {mastery}% {isMl ? 'വിജയം' : 'Mastery'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Stage Detail View */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-extrabold text-[#8055E8] uppercase tracking-wider">
            {isMl ? `ഘട്ടം ${selectedStage.id}` : `Stage ${selectedStage.id}`}
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {isMl ? selectedStage.titleMl : selectedStage.titleEn}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-malayalam">
            {isMl ? selectedStage.descriptionMl : selectedStage.descriptionEn}
          </p>
        </div>

        {/* If user is inside a quiz */}
        {inQuizMode && activeLesson ? (
          <div className="space-y-6 max-w-2xl mx-auto py-2">
            {!showQuizResult ? (
              <div className="space-y-5 animate-fade-in">
                {/* Quiz Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-[#4F7CFF] uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    {isMl ? 'ഘട്ട പരീക്ഷ (Mastery Quiz)' : 'Stage Mastery Quiz'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Question {quizQuestionIndex + 1} of {activeLesson.quiz.length}
                  </span>
                </div>

                {/* Question Prompt */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeLesson.quiz[quizQuestionIndex].questionEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-malayalam mt-1">
                    {activeLesson.quiz[quizQuestionIndex].questionMl}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {activeLesson.quiz[quizQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[quizQuestionIndex] === optIdx;
                    const hasAnswered = selectedAnswers[quizQuestionIndex] !== undefined;
                    const isCorrect = optIdx === activeLesson.quiz[quizQuestionIndex].correctIndex;

                    let btnClass = 'border-slate-200 hover:border-[#4F7CFF] bg-slate-50/50 text-slate-800';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnClass = 'border-red-400 bg-red-50 text-red-900';
                      } else {
                        btnClass = 'border-slate-200 bg-slate-50/30 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Malayalam Explanation after answering */}
                {selectedAnswers[quizQuestionIndex] !== undefined && (
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-800 text-xs sm:text-sm font-malayalam space-y-1 animate-pop">
                    <div className="font-bold text-[#4F7CFF] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      {isMl ? 'മലയാള വിശദീകരണം:' : 'Malayalam Explanation:'}
                    </div>
                    <p>{activeLesson.quiz[quizQuestionIndex].explanationMl}</p>
                  </div>
                )}

                {/* Next / Submit Button */}
                {selectedAnswers[quizQuestionIndex] !== undefined && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {quizQuestionIndex < activeLesson.quiz.length - 1
                        ? (isMl ? 'അടുത്ത ചോദ്യം' : 'Next Question')
                        : (isMl ? 'ഫലം കാണുക' : 'See Quiz Results')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* Quiz Results Card */
              <div className="text-center p-6 space-y-4 animate-pop">
                {(() => {
                  let correct = 0;
                  activeLesson.quiz.forEach((q, idx) => {
                    if (selectedAnswers[idx] === q.correctIndex) correct++;
                  });
                  const pct = Math.round((correct / activeLesson.quiz.length) * 100);
                  const passed = pct >= 70;

                  return (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg text-2xl font-black bg-gradient-to-tr from-[#4F7CFF] to-[#8055E8] text-white">
                        {passed ? '🎉' : '💪'}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900">
                        {passed
                          ? (isMl ? 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾ വിജയിച്ചു!' : 'Congratulations! Quiz Passed!')
                          : (isMl ? 'നന്നായി ശ്രമിച്ചു, ഒരിക്കൽ കൂടി പരീക്ഷിക്കൂ' : 'Good effort! Try again to unlock.')}
                      </h3>

                      <div className="text-4xl font-black text-[#4F7CFF] tabular-nums">
                        {pct}%
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-malayalam max-w-md mx-auto">
                        {passed
                          ? (isMl
                              ? `നിങ്ങൾ ${correct}/${activeLesson.quiz.length} ചോദ്യങ്ങൾക്ക് ശരിയുത്തരം നൽകി. അടുത്ത ഘട്ടങ്ങൾ അൺലോക്ക് ചെയ്യാൻ ഈ സ്കോർ സഹായിക്കും.`
                              : `You answered ${correct} out of ${activeLesson.quiz.length} correctly. Great job!`)
                          : (isMl
                              ? 'അടുത്ത ഘട്ടം തുറക്കാൻ 70% സ്കോർ ആവശ്യമാണ്. പാഠം വീണ്ടും വായിച്ച് വീണ്ടും ശ്രമിക്കുക.'
                              : 'You need 70% to master this checkpoint. Review the lesson and give it another try!')}
                      </p>

                      <div className="flex justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setQuizQuestionIndex(0);
                            setSelectedAnswers({});
                            setShowQuizResult(false);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{isMl ? 'വീണ്ടും ചെയ്യുക' : 'Retry Quiz'}</span>
                        </button>
                        <button
                          onClick={() => setInQuizMode(false)}
                          className="px-5 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white text-xs font-bold shadow-md"
                        >
                          {isMl ? 'പാഠങ്ങളിലേക്ക് മടങ്ങുക' : 'Back to Lessons'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Normal Lessons List */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStage.lessons.map((lesson, idx) => {
                const lessonKey = `stage_${selectedStage.id}_${lesson.id}`;
                const isDone = progress.completedLessons.includes(lessonKey);

                return (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#4F7CFF]/50 shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Lesson {idx + 1}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isMl ? 'പൂർത്തിയായി' : 'Done'}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">
                      {isMl ? lesson.titleMl : lesson.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-malayalam line-clamp-2">
                      {isMl ? lesson.summaryMl : lesson.summaryEn}
                    </p>

                    {/* Key Lesson Points Preview */}
                    <div className="space-y-1.5 pt-1">
                      {lesson.contentPoints.slice(0, 3).map((pt, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-xl bg-slate-50 text-xs flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-800">{pt.en}</span>
                            <span className="text-slate-500 font-malayalam block text-[11px]">{pt.ml}</span>
                          </div>
                          {pt.example && (
                            <button
                              onClick={() => handlePlayAudio(pt.example!, `${lesson.id}_${pIdx}`)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:border-[#4F7CFF] flex items-center justify-center text-slate-600 shrink-0"
                              title="Listen pronunciation"
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${audioPlaying === `${lesson.id}_${pIdx}` ? 'text-[#4F7CFF] animate-pulse' : ''}`} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleStartQuiz(lesson)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>{isMl ? 'ക്വിസ്സ് ആരംഭിക്കുക' : 'Start Checkpoint Quiz'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
