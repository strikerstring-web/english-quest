import React, { useState } from 'react';
import { UserProgress, WritingPrompt } from '../types';
import { WRITING_PROMPTS } from '../data/writingPrompts';
import { speakText } from '../utils/speech';
import { triggerRewardEffect } from '../utils/storage';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  BookOpen, 
  Award, 
  ArrowRight, 
  RotateCcw,
  HelpCircle,
  FileText,
  Lightbulb,
  Copy
} from 'lucide-react';

interface WritingStudioProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

interface WritingFeedbackResponse {
  score: number;
  scoreBreakdown: {
    grammar: number;
    vocabulary: number;
    structure: number;
    clarity: number;
  };
  originalSentence: string;
  correctedSentence: string;
  explanationMalayalam: string;
  betterVocabulary: Array<{ original: string; better: string; malayalam: string }>;
  improvedVersion: string;
  encouragement: string;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';

  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[0]);
  const [userText, setUserText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<WritingFeedbackResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;
  const charCount = userText.length;

  const handleApplyStarter = (starter: string) => {
    if (!userText.trim()) {
      setUserText(starter);
    } else {
      setUserText((prev) => `${prev} ${starter}`);
    }
  };

  const handleEvaluate = async () => {
    if (!userText.trim()) {
      setErrorMsg(isMl ? 'ദയവായി എന്തെങ്കിലും എഴുതുക' : 'Please write something first');
      return;
    }
    setErrorMsg(null);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityTitle: selectedPrompt.titleEn,
          promptText: selectedPrompt.descriptionEn,
          userText: userText.trim(),
          userLevel: progress.selectedLevel || 'Beginner'
        })
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Feedback is temporarily unavailable.');
      const data: WritingFeedbackResponse = await res.json();
      setFeedback(data);
      triggerRewardEffect(true);

      // Save progress
      onUpdateProgress((prev) => {
        const historyEntry = {
          id: `write_${Date.now()}`,
          date: new Date().toLocaleDateString(),
          activityTitle: selectedPrompt.titleEn,
          score: data.score,
          text: userText.trim()
        };
        const alreadyRewarded = prev.writingHistory.some((entry) =>
          entry.activityTitle === historyEntry.activityTitle && entry.text.trim() === historyEntry.text
        );
        if (alreadyRewarded) return prev;
        const newSentences = prev.sentencesWritten + 1;
        const newXp = prev.xp + 35;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          ...prev,
          sentencesWritten: newSentences,
          xp: newXp,
          level: newLevel,
          coins: prev.coins + 8,
          writingHistory: [historyEntry, ...prev.writingHistory].slice(0, 20)
        };
      });
    } catch (err: any) {
      console.error('Writing evaluation error:', err);
      setFeedback(null);
      setErrorMsg(err?.message || (isMl
        ? 'AI പരിശോധന ഇപ്പോൾ ലഭ്യമല്ല. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.'
        : 'AI feedback is currently unavailable. Please try again shortly.'));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePlayAudio = (text: string) => {
    setAudioPlaying(true);
    speakText(text, 'en-US', () => setAudioPlaying(false));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8055E8] bg-purple-50 px-2.5 py-1 rounded-lg">
            {isMl ? '100-പോയിന്റ് AI മൂല്യനിർണ്ണയം' : '100-Point AI Rubric Studio'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            {isMl ? 'റൈറ്റിംഗ് സ്റ്റുഡിയോ (Writing Studio)' : 'Writing Studio'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-malayalam mt-1">
            {isMl
              ? 'വാക്യങ്ങൾ എഴുതുക, മലയാള വിശദീകരണത്തോടെ തെറ്റുകൾ തിരുത്തുക, മികച്ച പദാവലി പഠിക്കുക'
              : 'Write English sentences, get instant 100-point scoring, Malayalam corrections, and vocabulary upgrades.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <div className="text-slate-500 font-medium">
              {isMl ? 'എഴുതിയ വാക്യങ്ങൾ' : 'Sentences Written'}
            </div>
            <div className="text-slate-900 font-black tabular-nums">
              {progress.sentencesWritten}
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {WRITING_PROMPTS.map((prompt, idx) => {
          const isSelected = selectedPrompt.id === prompt.id;
          return (
            <button
              key={prompt.id}
              onClick={() => {
                setSelectedPrompt(prompt);
                setFeedback(null);
                setUserText('');
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[#8055E8] bg-purple-50/80 shadow-sm ring-2 ring-[#8055E8]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400">
                Task {idx + 1}
              </div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {prompt.titleEn.split('.')[1]?.trim() || prompt.titleEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Prompt Card & Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Active Prompt Info */}
          <div className="border-b border-slate-100 pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8055E8] uppercase tracking-wider">
                Current Exercise
              </span>
              <span className="text-xs text-slate-500">
                Target: {selectedPrompt.targetWords} words
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {isMl ? selectedPrompt.titleMl : selectedPrompt.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-malayalam leading-relaxed">
              {isMl ? selectedPrompt.descriptionMl : selectedPrompt.descriptionEn}
            </p>
          </div>

          {/* Malayalam Guidance Callout */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs font-malayalam flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold mr-1">മാർഗ്ഗനിർദ്ദേശം:</span>
              {selectedPrompt.malayalamGuidance}
            </div>
          </div>

          {/* Starter Sentence / Keywords Aid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                {isMl ? 'തുടങ്ങാൻ സഹായിക്കുന്ന ശൈലി:' : 'Starter Sentence Cue:'}
              </span>
              {selectedPrompt.starterSentenceEn && (
                <button
                  onClick={() => handleApplyStarter(selectedPrompt.starterSentenceEn!)}
                  className="text-[#4F7CFF] font-bold flex items-center gap-1 hover:underline text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isMl ? 'പകർത്തുക' : 'Use Starter'}</span>
                </button>
              )}
            </div>

            {selectedPrompt.starterSentenceEn && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">"{selectedPrompt.starterSentenceEn}"</span>
                <span className="text-slate-400 font-malayalam text-[11px]">{selectedPrompt.starterSentenceMl}</span>
              </div>
            )}

            {/* Keyword Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                Keywords:
              </span>
              {selectedPrompt.suggestedKeywords.map((kw, kIdx) => (
                <button
                  key={kIdx}
                  onClick={() => handleApplyStarter(kw.en)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <span className="font-bold">{kw.en}</span>
                  <span className="text-[10px] text-slate-500 font-malayalam">({kw.ml})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Writing Textarea */}
          <div className="space-y-2">
            <textarea
              rows={5}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder={isMl ? 'നിങ്ങളുടെ ഇംഗ്ലീഷ് വാക്യം ഇവിടെ എഴുതുക...' : 'Write your English sentences here...'}
              className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#8055E8] text-sm text-slate-900 leading-relaxed"
            />

            {/* Word & Char Counters */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums font-semibold text-slate-600">
                  {wordCount} words
                </span>
                <span>·</span>
                <span className="font-mono tabular-nums">{charCount} characters</span>
              </div>
              <span className={wordCount >= selectedPrompt.minWords ? 'text-emerald-600 font-bold' : ''}>
                Min {selectedPrompt.minWords} words
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-500 font-bold font-malayalam">
              {errorMsg}
            </div>
          )}

          {/* Submit Action */}
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !userText.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
              isEvaluating || !userText.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8055E8] to-[#4F7CFF] text-white hover:opacity-95 active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isEvaluating
                ? (isMl ? 'AI പരിശോധിക്കുന്നു (100-ൽ സ്കോർ)...' : 'Evaluating with AI (100-Point Rubric)...')
                : (isMl ? 'പരിശോധിച്ച് സ്കോർ നേടൂ' : 'Submit & Get 100-Pt AI Score')}
            </span>
          </button>
        </div>

        {/* Right Side: 100-Point Feedback Report Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-start">
          {feedback ? (
            <div className="space-y-5 animate-pop">
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Writing Assessment
                  </span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {feedback.score >= 80 ? '🌟 Outstanding Work!' : feedback.score >= 60 ? '👍 Good Progress!' : '🌱 Needs Practice'}
                  </div>
                </div>

                <div className="text-center px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="text-2xl font-black text-[#8055E8] tabular-nums">
                    {feedback.score}/100
                  </div>
                  <div className="text-[10px] font-bold text-purple-700 uppercase">
                    Total Score
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown Bars */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-600 block mb-1">
                  100-Point Criteria Breakdown:
                </span>
                
                {/* Grammar 30 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Grammar & Mechanics</span>
                    <span className="font-bold tabular-nums">{feedback.scoreBreakdown?.grammar || 24}/30</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4F7CFF] h-full rounded-full" style={{ width: `${((feedback.scoreBreakdown?.grammar || 24) / 30) * 100}%` }} />
                  </div>
                </div>

                {/* Vocabulary 25 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Vocabulary Choice</span>
                    <span className="font-bold tabular-nums">{feedback.scoreBreakdown?.vocabulary || 20}/25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#8055E8] h-full rounded-full" style={{ width: `${((feedback.scoreBreakdown?.vocabulary || 20) / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Structure 25 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Sentence Structure</span>
                    <span className="font-bold tabular-nums">{feedback.scoreBreakdown?.structure || 20}/25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#37D6A0] h-full rounded-full" style={{ width: `${((feedback.scoreBreakdown?.structure || 20) / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Clarity 20 */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Clarity & Prompt Relevance</span>
                    <span className="font-bold tabular-nums">{feedback.scoreBreakdown?.clarity || 16}/20</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${((feedback.scoreBreakdown?.clarity || 16) / 20) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* 1. Original vs 2. Corrected */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase">
                    1. Original Sentence
                  </span>
                  <p className="text-slate-800 italic mt-0.5">"{feedback.originalSentence}"</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block text-[10px] uppercase flex items-center justify-between">
                    <span>2. Corrected Sentence</span>
                    <button
                      onClick={() => handlePlayAudio(feedback.correctedSentence)}
                      className="text-emerald-700 flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Audio</span>
                    </button>
                  </span>
                  <p className="text-emerald-950 font-bold mt-0.5">"{feedback.correctedSentence}"</p>
                </div>
              </div>

              {/* 3. Malayalam Explanation */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs font-malayalam space-y-1">
                <span className="font-bold text-[#4F7CFF] block">
                  3. മലയാള വിശദീകരണം:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {feedback.explanationMalayalam}
                </p>
              </div>

              {/* 4. Better Vocabulary */}
              {feedback.betterVocabulary && feedback.betterVocabulary.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block">
                    4. Better Vocabulary Suggestions:
                  </span>
                  <div className="space-y-1">
                    {feedback.betterVocabulary.map((vocab, vIdx) => (
                      <div key={vIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-500 line-through">{vocab.original}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-[#8055E8]">{vocab.better}</span>
                        <span className="text-slate-500 font-malayalam text-[11px]">({vocab.malayalam})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Suggested Improved Sentence */}
              {feedback.improvedVersion && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-[11px] uppercase">
                      5. Polished Native Version
                    </span>
                    <button
                      onClick={() => handlePlayAudio(feedback.improvedVersion)}
                      className="text-[#8055E8] flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-purple-950 font-medium italic">
                    "{feedback.improvedVersion}"
                  </p>
                </div>
              )}

              <p className="text-xs text-center text-slate-400 italic">
                {feedback.encouragement}
              </p>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">
                {isMl ? 'വിശകലന ഫലം ഇവിടെ കാണാം' : 'AI Diagnostic Card'}
              </h3>
              <p className="text-xs font-malayalam max-w-xs text-slate-500">
                {isMl
                  ? 'ഇടതുവശത്ത് നിങ്ങളുടെ വാക്യം എഴുതി "Submit" ചെയ്യുമ്പോൾ 100-ൽ സ്കോറും വിശദീകരണവും ഇവിടെ ലഭിക്കും.'
                  : 'Write your sentence on the left and submit to receive a 100-point rubric assessment, corrected sentence diff, and Malayalam tips.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
