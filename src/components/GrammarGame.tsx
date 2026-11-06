import React, { useState } from 'react';
import { UserProgress, GrammarTopic, GrammarQuestion } from '../types';
import { GRAMMAR_TOPICS } from '../data/grammar';
import { LEVEL_GRAMMAR_TOPICS } from '../data/levelGrammar';
import { triggerRewardEffect } from '../utils/storage';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface GrammarGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const GrammarGame: React.FC<GrammarGameProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';

  const [selectedTopicId, setSelectedTopicId] = useState<string>('pronouns');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [showTopicCompletion, setShowTopicCompletion] = useState<boolean>(false);
  
  // Arrange sentence mode state
  const [arrangedTokens, setArrangedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);

  const selectedBand = progress.selectedLevel === 'Advanced' ? 'Advanced' : progress.selectedLevel === 'Intermediate' ? 'Intermediate' : 'Beginner';
  const availableTopics = [...GRAMMAR_TOPICS, ...LEVEL_GRAMMAR_TOPICS].filter((topic) => !topic.level || selectedBand === 'Advanced' || topic.level === selectedBand);
  const activeTopic = availableTopics.find((t) => t.id === selectedTopicId) || availableTopics[0];
  const currentQ: GrammarQuestion = activeTopic.questions[currentQuestionIdx % activeTopic.questions.length];

  React.useEffect(() => {
    if (!availableTopics.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId(availableTopics[0]?.id || 'pronouns');
      setCurrentQuestionIdx(0);
    }
  }, [progress.selectedLevel]);

  // Initialize arrange sentence tokens when question changes
  React.useEffect(() => {
    if (currentQ.type === 'arrange_sentence' && currentQ.shuffledWords) {
      setAvailableTokens([...currentQ.shuffledWords]);
      setArrangedTokens([]);
    }
    setSelectedAnswer(null);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(false);
  }, [currentQuestionIdx, selectedTopicId]);

  const handleSelectOption = (opt: string) => {
    if (hasCheckedAnswer) return;
    setSelectedAnswer(opt);
    const correct = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsAnswerCorrect(correct);
    setHasCheckedAnswer(true);

    if (correct) awardCorrectAnswer();
  };

  const awardCorrectAnswer = () => {
    const questionKey = `grammar_question_${currentQ.id}`;
    if (progress.completedLessons.includes(questionKey)) return;

    triggerRewardEffect(false);
    onUpdateProgress((prev) => {
      const completed = new Set([...prev.completedLessons, questionKey]);
      const topicMastered = activeTopic.questions.every((question) =>
        completed.has(`grammar_question_${question.id}`)
      );
      if (topicMastered) completed.add(`grammar_${activeTopic.id}`);
      const newXp = prev.xp + 15;
      return {
        ...prev,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        coins: prev.coins + 2,
        completedLessons: Array.from(completed)
      };
    });
  };

  // Arrange tokens click
  const handleTokenClick = (word: string, fromArranged: boolean) => {
    if (hasCheckedAnswer) return;
    if (fromArranged) {
      setArrangedTokens(arrangedTokens.filter((w, i) => i !== arrangedTokens.lastIndexOf(word)));
      setAvailableTokens([...availableTokens, word]);
    } else {
      setAvailableTokens(availableTokens.filter((w, i) => i !== availableTokens.indexOf(word)));
      setArrangedTokens([...arrangedTokens, word]);
    }
  };

  const handleCheckArrangement = () => {
    const constructed = arrangedTokens.join(' ').trim();
    const target = currentQ.correctAnswer.trim();
    const correct = constructed.toLowerCase() === target.toLowerCase();
    setSelectedAnswer(constructed);
    setIsAnswerCorrect(correct);
    setHasCheckedAnswer(true);

    if (correct) awardCorrectAnswer();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeTopic.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      return;
    }
    triggerRewardEffect(true);
    setShowTopicCompletion(true);
  };

  const replayCurrentTopic = () => {
    setCurrentQuestionIdx(0);
    setShowTopicCompletion(false);
    setSelectedAnswer(null);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(false);
  };

  const goToNextTopic = () => {
    const currentIndex = availableTopics.findIndex((topic) => topic.id === activeTopic.id);
    const nextTopic = availableTopics[(currentIndex + 1) % availableTopics.length];
    if (nextTopic) {
      setSelectedTopicId(nextTopic.id);
      setCurrentQuestionIdx(0);
    }
    setShowTopicCompletion(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8055E8] bg-purple-50 px-2.5 py-1 rounded-lg">
            {isMl ? `${availableTopics.length} വ്യാകരണ വിഷയങ്ങൾ` : `${availableTopics.length} Grammar Topics · ${selectedBand}`}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            {isMl ? 'ഗ്രാമർ ലാബ് (Grammar Lab)' : 'Grammar Quests'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-malayalam mt-1">
            {isMl
              ? 'സർവ്വനാമങ്ങൾ, ക്രിയകൾ, കാലങ്ങൾ, പ്രെപ്പോസിഷനുകൾ എന്നിവ മലയാള വിശദീകരണത്തോടെ പഠിക്കാം'
              : 'Interactive sentence building, finding mistakes, and fill-in-the-blanks with Malayalam guidance.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-2 rounded-2xl border border-purple-200 text-xs">
          <Award className="w-5 h-5 text-[#8055E8]" />
          <div>
            <div className="text-purple-600 font-bold">
              {isMl ? 'പൂർത്തിയായ വിഷയങ്ങൾ' : 'Topics Done'}
            </div>
            <div className="text-slate-900 font-black">
              {progress.completedLessons.filter((l) => availableTopics.some((topic) => l === `grammar_${topic.id}`)).length} / {availableTopics.length}
            </div>
          </div>
        </div>
      </div>

      {/* Topics Selector Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {availableTopics.map((topic) => {
          const isDone = progress.completedLessons.includes(`grammar_${topic.id}`);
          const isSelected = selectedTopicId === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopicId(topic.id);
                setCurrentQuestionIdx(0);
                setShowTopicCompletion(false);
              }}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{isMl ? topic.titleMl.split('(')[0] : topic.titleEn.split('(')[0]}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Topic Rules & Explanations in Malayalam */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Grammar Rule Guide
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {isMl ? activeTopic.titleMl : activeTopic.titleEn}
            </h2>
            <p className="text-xs text-slate-500 font-malayalam mt-1">
              {isMl ? activeTopic.descriptionMl : activeTopic.descriptionEn}
            </p>
          </div>

          <div className="space-y-2.5 font-malayalam text-xs text-slate-700">
            {activeTopic.rulesMl.map((rule, rIdx) => (
              <div key={rIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed">
                <span className="font-bold text-[#4F7CFF] mr-1.5">●</span>
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Quiz Game Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#4F7CFF]">
                {currentQ.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-slate-400">
                Question {currentQuestionIdx + 1} of {activeTopic.questions.length}
              </span>
            </div>
            <span className="font-bold text-amber-500">+15 XP</span>
          </div>

          {/* Prompt */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {currentQ.promptEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-malayalam">
              {currentQ.promptMl}
            </p>
          </div>

          {/* GAME TYPE 1: MULTIPLE CHOICE or FILL BLANK or FIND MISTAKE */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'fill_blank' || currentQ.type === 'find_mistake') && currentQ.options && (
            <div className="space-y-3">
              {currentQ.type === 'find_mistake' && currentQ.sentenceWithMistake && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 font-bold text-base text-center">
                  "{currentQ.sentenceWithMistake}"
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                  let btnStyle = 'border-slate-200 hover:border-[#4F7CFF] bg-slate-50/40 text-slate-800';
                  if (hasCheckedAnswer) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-red-400 bg-red-50 text-red-900';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50/30 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasCheckedAnswer}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between text-left ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {hasCheckedAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {hasCheckedAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME TYPE 2: ARRANGE WORDS INTO SENTENCES */}
          {currentQ.type === 'arrange_sentence' && (
            <div className="space-y-4">
              {/* Construction Slot */}
              <div className="min-h-[70px] p-4 rounded-2xl border-2 border-dashed border-[#4F7CFF]/50 bg-blue-50/30 flex flex-wrap items-center gap-2">
                {arrangedTokens.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    {isMl ? 'വാക്കുകൾ തൊട്ട് ശരിയായ ക്രമത്തിൽ ഇവിടെ അടുക്കുക...' : 'Tap the word chips below to arrange the sentence...'}
                  </span>
                ) : (
                  arrangedTokens.map((word, wIdx) => (
                    <button
                      key={wIdx}
                      disabled={hasCheckedAnswer}
                      onClick={() => handleTokenClick(word, true)}
                      className="px-3.5 py-2 rounded-xl bg-[#4F7CFF] text-white text-sm font-bold shadow-xs hover:bg-[#3E6DE8] active:scale-95 transition-all"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Available Token Pool */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {availableTokens.map((word, wIdx) => (
                  <button
                    key={wIdx}
                    disabled={hasCheckedAnswer}
                    onClick={() => handleTokenClick(word, false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:border-[#4F7CFF] hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs active:scale-95 transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {!hasCheckedAnswer && arrangedTokens.length > 0 && (
                <button
                  onClick={handleCheckArrangement}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-all"
                >
                  {isMl ? 'പരിശോധിക്കുക (Check Sentence)' : 'Check Sentence'}
                </button>
              )}
            </div>
          )}

          {/* Malayalam Explanation Feedback Card */}
          {hasCheckedAnswer && (
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-800 space-y-2 animate-pop">
              <div className="flex items-center gap-2">
                {isAnswerCorrect ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    {isMl ? 'ശരിയുത്തരം! വളരെ നല്ലത്!' : 'Correct Answer! Well done!'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600 font-extrabold text-sm">
                    <XCircle className="w-5 h-5 text-red-500" />
                    {isMl ? `ശരിയായ ഉത്തരം: "${currentQ.correctAnswer}"` : `Correct Answer: "${currentQ.correctAnswer}"`}
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-malayalam text-slate-700 pt-1">
                <span className="font-bold text-[#4F7CFF] mr-1">വിശദീകരണം:</span>
                {currentQ.explanationMl}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full mt-3 py-3 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>
                  {currentQuestionIdx < activeTopic.questions.length - 1
                    ? (isMl ? 'അടുത്ത ചോദ്യം' : 'Next Question')
                    : (isMl ? 'വിഷയം പൂർത്തിയായി! അടുത്തതിലേക്ക്' : 'Topic Complete! Next')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showTopicCompletion && (
        <div className="max-w-2xl mx-auto bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="text-4xl">🎉</div>
          <h2 className="text-xl font-black text-slate-900">
            {isMl ? 'ഈ വിഷയം പൂർത്തിയായി!' : 'Topic Completed!'}
          </h2>
          <p className="text-sm text-slate-600 font-malayalam">
            {isMl
              ? 'അടുത്ത വിഷയത്തിലേക്ക് പോകണോ, അതോ ഈ വിഷയം വീണ്ടും പരിശീലിക്കണോ?'
              : 'Would you like to move to the next topic or practise this topic again?'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={goToNextTopic} className="px-6 py-3 rounded-xl bg-[#4F7CFF] text-white font-bold text-sm shadow-md hover:bg-[#3E6DE8] transition-colors">
              {isMl ? 'അടുത്ത വിഷയം' : 'Go to Next Topic'} →
            </button>
            <button onClick={replayCurrentTopic} className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors">
              <span className="inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" />{isMl ? 'ഇതേ വിഷയം വീണ്ടും പഠിക്കുക' : 'Replay Current Topic'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
