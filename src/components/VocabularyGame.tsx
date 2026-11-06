import React, { useState, useMemo } from 'react';
import { UserProgress, VocabItem } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { LEVEL_VOCABULARY_LIST } from '../data/levelVocabulary';
import { speakText } from '../utils/speech';
import { triggerRewardEffect } from '../utils/storage';
import { 
  Volume2, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw, 
  Search, 
  HelpCircle, 
  Grid, 
  Play, 
  Headphones, 
  Shuffle,
  BookOpen
} from 'lucide-react';

interface VocabularyGameProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

type VocabMode = 'quiz' | 'match' | 'spelling' | 'picture' | 'listen' | 'explorer';

export const VocabularyGame: React.FC<VocabularyGameProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';
  const selectedBand = progress.selectedLevel === 'Advanced' ? 'Advanced' : progress.selectedLevel === 'Intermediate' ? 'Intermediate' : 'Beginner';
  const availableVocabulary = [...VOCABULARY_LIST, ...LEVEL_VOCABULARY_LIST].filter((item) => !item.level || selectedBand === 'Advanced' || item.level === selectedBand);

  const [activeMode, setActiveMode] = useState<VocabMode>('quiz');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [audioActiveId, setAudioActiveId] = useState<string | null>(null);

  // Search filter for explorer
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Matching game state
  const [matchSelectedEn, setMatchSelectedEn] = useState<string | null>(null);
  const [matchSelectedMl, setMatchSelectedMl] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Spelling game state
  const [spellingInput, setSpellingInput] = useState<string[]>([]);

  const currentWord = availableVocabulary[currentWordIndex % availableVocabulary.length];

  // Options for Meaning Quiz
  const quizOptions = useMemo(() => {
    const distractors = availableVocabulary
      .filter((v) => v.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((v) => v.malayalam);
    const all = [currentWord.malayalam, ...distractors];
    return all.sort(() => 0.5 - Math.random());
  }, [currentWordIndex, availableVocabulary]);

  // Options for Picture Quiz
  const pictureOptions = useMemo(() => {
    const distractors = availableVocabulary
      .filter((v) => v.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((v) => v.word);
    const all = [currentWord.word, ...distractors];
    return all.sort(() => 0.5 - Math.random());
  }, [currentWordIndex]);

  // 4 words for Match Tiles
  const matchBatch = useMemo(() => {
    const start = (currentWordIndex * 4) % (availableVocabulary.length - 4);
    return availableVocabulary.slice(start, start + 4);
  }, [currentWordIndex]);

  const matchEnglishWords = useMemo(() => {
    return [...matchBatch].sort(() => 0.5 - Math.random());
  }, [matchBatch]);

  const matchMalayalamWords = useMemo(() => {
    return [...matchBatch].sort(() => 0.5 - Math.random());
  }, [matchBatch]);

  // Missing letter for spelling game
  const missingLetterIndex = useMemo(() => {
    const letters = currentWord.word.split('');
    // pick index between 1 and length-2 if possible
    if (letters.length <= 3) return 1;
    return Math.floor(Math.random() * (letters.length - 2)) + 1;
  }, [currentWordIndex]);

  const spellingCandidateLetters = useMemo(() => {
    const targetLetter = currentWord.word[missingLetterIndex]?.toUpperCase();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const fakeLetters = alphabet
      .filter((l) => l !== targetLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [targetLetter, ...fakeLetters].sort(() => 0.5 - Math.random());
  }, [currentWord, missingLetterIndex]);

  const handlePlayWordAudio = (word: string, id: string) => {
    setAudioActiveId(id);
    speakText(word, 'en-US', () => setAudioActiveId(null));
  };

  const handleAnswerSubmit = (chosen: string, isCorrect: boolean) => {
    if (hasAnswered) return;
    setSelectedOption(chosen);
    setHasAnswered(true);

    if (isCorrect) {
      setScore((s) => s + 1);
      triggerRewardEffect(false);

      // Award XP & add word to learned words
      onUpdateProgress((prev) => {
        const isNewWord = !prev.wordsLearned.includes(currentWord.id);
        const newLearned = isNewWord ? [...prev.wordsLearned, currentWord.id] : prev.wordsLearned;
        const newXp = prev.xp + 10;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          coins: prev.coins + 2,
          wordsLearned: newLearned,
        };
      });
    }
  };

  const handleNextWord = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setCurrentWordIndex((prev) => (prev + 1) % availableVocabulary.length);
  };

  // Match tile click
  const handleMatchSelect = (type: 'en' | 'ml', id: string) => {
    if (type === 'en') {
      setMatchSelectedEn(id);
      if (matchSelectedMl) {
        checkMatchPair(id, matchSelectedMl);
      }
    } else {
      setMatchSelectedMl(id);
      if (matchSelectedEn) {
        checkMatchPair(matchSelectedEn, id);
      }
    }
  };

  const checkMatchPair = (enId: string, mlId: string) => {
    if (enId === mlId) {
      // Match found!
      const newMatches = [...matchedPairs, enId];
      setMatchedPairs(newMatches);
      setMatchSelectedEn(null);
      setMatchSelectedMl(null);
      triggerRewardEffect(false);

      onUpdateProgress((prev) => ({
        ...prev,
        xp: prev.xp + 15,
        coins: prev.coins + 3,
        wordsLearned: Array.from(new Set([...prev.wordsLearned, enId]))
      }));

      if (newMatches.length >= 4) {
        // Complete batch
        setTimeout(() => {
          setMatchedPairs([]);
          setCurrentWordIndex((prev) => prev + 1);
        }, 800);
      }
    } else {
      // Mismatch
      setTimeout(() => {
        setMatchSelectedEn(null);
        setMatchSelectedMl(null);
      }, 500);
    }
  };

  // Filtered explorer items
  const filteredWords = useMemo(() => {
    return availableVocabulary.filter((w) => {
      const matchCat = selectedCategory === 'All' || w.category === selectedCategory;
      const matchText =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.malayalam.includes(searchQuery);
      return matchCat && matchText;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#37D6A0] bg-emerald-50 px-2.5 py-1 rounded-lg">
            {isMl ? `${availableVocabulary.length} ഇംഗ്ലീഷ് വാക്കുകൾ · ${selectedBand}` : `${availableVocabulary.length} Words · ${selectedBand}`}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            {isMl ? 'പദസമ്പത്ത് ക്വസ്റ്റ് (Vocabulary Quest)' : 'Vocabulary Games'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-malayalam mt-1">
            {isMl
              ? 'അർത്ഥം കണ്ടെത്തുക, വാക്കുകൾ പൊരുത്തപ്പെടുത്തുക, അക്ഷരങ്ങൾ കൂട്ടിച്ചേർക്കുക'
              : 'Interactive drills with Malayalam meanings, audio pronunciation, and example sentences.'}
          </p>
        </div>

        {/* Words Learned Tracker */}
        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs">
          <div className="text-slate-500 font-medium">
            {isMl ? 'പഠിച്ച വാക്കുകൾ' : 'Learned Words'}
          </div>
          <div className="text-lg font-black text-[#4F7CFF] tabular-nums">
            {progress.wordsLearned.length} / {availableVocabulary.length}
          </div>
        </div>
      </div>

      {/* Game Mode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'quiz' as VocabMode, labelEn: '1. Meaning Quiz', labelMl: '1. അർത്ഥം കണ്ടെത്തൂ' },
          { id: 'match' as VocabMode, labelEn: '2. Word Match', labelMl: '2. പൊരുത്തപ്പെടുത്തൂ' },
          { id: 'spelling' as VocabMode, labelEn: '3. Spell Letters', labelMl: '3. അക്ഷരം എഴുതൂ' },
          { id: 'picture' as VocabMode, labelEn: '4. Picture Word', labelMl: '4. ചിത്ര പൊരുത്തം' },
          { id: 'listen' as VocabMode, labelEn: '5. Listen & Guess', labelMl: '5. കേട്ടു പറയൂ' },
          { id: 'explorer' as VocabMode, labelEn: 'Dictionary (52 Words)', labelMl: 'നിഘണ്ടു (52 വാക്കുകൾ)' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setActiveMode(mode.id);
              setSelectedOption(null);
              setHasAnswered(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeMode === mode.id
                ? 'bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/20 scale-105'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={isMl ? 'font-malayalam' : ''}>
              {isMl ? mode.labelMl : mode.labelEn}
            </span>
          </button>
        ))}
      </div>

      {/* MODE 1: CHOOSE CORRECT MALAYALAM MEANING */}
      {activeMode === 'quiz' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
            <span>Word {currentWordIndex + 1} of {availableVocabulary.length}</span>
            <span className="font-bold text-[#4F7CFF]">+{10} XP for correct answer</span>
          </div>

          {/* Word Card */}
          <div className="text-center space-y-3 py-4">
            <span className="text-4xl">{currentWord.emoji}</span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {currentWord.word}
              </h2>
              <button
                onClick={() => handlePlayWordAudio(currentWord.word, 'main_quiz')}
                className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-[#4F7CFF] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                title="Listen audio"
              >
                <Volume2 className={`w-5 h-5 ${audioActiveId === 'main_quiz' ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {currentWord.phonetic}
            </p>
            <p className="text-xs text-slate-500 font-medium font-malayalam">
              {isMl ? 'ഈ വാക്കിന്റെ ശരിയായ മലയാള അർത്ഥം ഏതാണ്?' : 'Choose the correct Malayalam meaning:'}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentWord.malayalam;

              let btnStyle = 'border-slate-200 hover:border-[#4F7CFF] bg-slate-50/50 text-slate-800';
              if (hasAnswered) {
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
                  disabled={hasAnswered}
                  onClick={() => handleAnswerSubmit(opt, isCorrect)}
                  className={`p-4 rounded-2xl border text-sm font-semibold font-malayalam transition-all flex items-center justify-between text-left ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Example Sentence */}
          {hasAnswered && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-pop">
              <div className="font-bold text-slate-700 flex items-center justify-between">
                <span>Example Sentence:</span>
                <button
                  onClick={() => handlePlayWordAudio(currentWord.exampleEn, 'example_quiz')}
                  className="text-[#4F7CFF] flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
              <p className="text-slate-900 font-medium italic">"{currentWord.exampleEn}"</p>
              <p className="text-slate-500 font-malayalam">{currentWord.exampleMl}</p>

              <button
                onClick={handleNextWord}
                className="w-full mt-3 py-3 rounded-xl bg-[#4F7CFF] text-white font-bold text-sm shadow-md hover:bg-[#3E6DE8] transition-all"
              >
                {isMl ? 'അടുത്ത വാക്ക്' : 'Next Word'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: MATCH ENGLISH WORDS WITH MALAYALAM MEANINGS */}
      {activeMode === 'match' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {isMl ? 'വാക്കുകൾ പൊരുത്തപ്പെടുത്തുക' : 'Word Match Tiles'}
            </h2>
            <p className="text-xs text-slate-500 font-malayalam">
              {isMl
                ? 'ഇംഗ്ലീഷ് വാക്കിൽ തൊട്ട് അതിന്റെ ശരിയായ മലയാള അർത്ഥത്തിൽ തൊടുക'
                : 'Tap an English word and then tap its matching Malayalam meaning.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* English Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">
                English
              </span>
              {matchEnglishWords.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = matchSelectedEn === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleMatchSelect('en', item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-sm font-bold transition-all ${
                      isMatched
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60'
                        : isSelected
                        ? 'border-[#4F7CFF] bg-blue-50 text-[#4F7CFF] shadow-sm ring-2 ring-[#4F7CFF]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{item.word}</span>
                  </button>
                );
              })}
            </div>

            {/* Malayalam Column */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">
                മലയാളം
              </span>
              {matchMalayalamWords.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = matchSelectedMl === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleMatchSelect('ml', item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-sm font-bold font-malayalam transition-all ${
                      isMatched
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60'
                        : isSelected
                        ? 'border-[#8055E8] bg-purple-50 text-[#8055E8] shadow-sm ring-2 ring-[#8055E8]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span>{item.malayalam}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Matched: {matchedPairs.length} / 4 pairs</span>
            <button
              onClick={() => {
                setMatchedPairs([]);
                setCurrentWordIndex((prev) => prev + 1);
              }}
              className="text-[#4F7CFF] font-bold flex items-center gap-1 hover:underline"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isMl ? 'പുതിയ വാക്കുകൾ' : 'New Batch'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: FILL IN MISSING LETTERS */}
      {activeMode === 'spelling' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">{currentWord.emoji}</span>
            <h2 className="text-xl font-bold text-slate-900">
              {isMl ? 'വിട്ടുപോയ അക്ഷരം ചേർക്കുക' : 'Fill in the Missing Letter'}
            </h2>
            <p className="text-xs text-slate-500 font-malayalam">
              {currentWord.malayalam} ({currentWord.hint})
            </p>
          </div>

          {/* Letter Boxes */}
          <div className="flex justify-center items-center gap-2 py-4">
            {currentWord.word.split('').map((char, idx) => {
              const isMissing = idx === missingLetterIndex;
              const filledChar = hasAnswered ? char.toUpperCase() : (isMissing ? '?' : char.toUpperCase());

              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl flex items-center justify-center text-xl font-black border-2 transition-all ${
                    isMissing
                      ? hasAnswered
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-[#4F7CFF] bg-blue-50/70 text-[#4F7CFF] border-dashed animate-pulse'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  {filledChar}
                </div>
              );
            })}
          </div>

          {/* Candidate Letter Tiles */}
          {!hasAnswered ? (
            <div className="space-y-3">
              <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider">
                Select the missing letter:
              </p>
              <div className="flex justify-center gap-3">
                {spellingCandidateLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const isCorrect = letter === currentWord.word[missingLetterIndex]?.toUpperCase();
                      handleAnswerSubmit(letter, isCorrect);
                    }}
                    className="w-14 h-14 rounded-2xl border-2 border-slate-200 hover:border-[#4F7CFF] hover:bg-blue-50 text-xl font-black text-slate-800 shadow-sm active:scale-95 transition-all"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-pop">
              <div className="flex items-center justify-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg">
                  {currentWord.word}
                </span>
                <button
                  onClick={() => handlePlayWordAudio(currentWord.word, 'spell_audio')}
                  className="w-8 h-8 rounded-full bg-blue-50 text-[#4F7CFF] flex items-center justify-center"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 font-malayalam">
                {currentWord.exampleEn} — {currentWord.exampleMl}
              </p>
              <button
                onClick={handleNextWord}
                className="w-full py-3 rounded-xl bg-[#4F7CFF] text-white font-bold text-sm shadow-md"
              >
                {isMl ? 'അടുത്ത വാക്ക്' : 'Next Word'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: PICTURE / VISUAL WORD SELECTION */}
      {activeMode === 'picture' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-6xl inline-block p-4 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
              {currentWord.emoji}
            </span>
            <p className="text-xs font-bold text-slate-500 font-malayalam pt-2">
              {isMl ? `ഈ ചിത്രത്തിന് അനുയോജ്യമായ വാക്ക് ഏതാണ്? (${currentWord.malayalam})` : `Choose the English word for this concept:`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pictureOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentWord.word;

              let btnStyle = 'border-slate-200 hover:border-[#4F7CFF] bg-slate-50/50 text-slate-800';
              if (hasAnswered) {
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
                  disabled={hasAnswered}
                  onClick={() => handleAnswerSubmit(opt, isCorrect)}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all text-center ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-pop">
              <p className="text-slate-800 font-bold">
                {currentWord.word} = {currentWord.malayalam}
              </p>
              <p className="text-slate-500">{currentWord.exampleEn}</p>
              <button
                onClick={handleNextWord}
                className="w-full mt-2 py-3 rounded-xl bg-[#4F7CFF] text-white font-bold text-sm shadow-md"
              >
                {isMl ? 'അടുത്ത വാക്ക്' : 'Next Word'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: LISTEN & IDENTIFY THE WORD */}
      {activeMode === 'listen' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-3 py-4">
            <button
              onClick={() => handlePlayWordAudio(currentWord.word, 'listen_challenge')}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F7CFF] to-[#8055E8] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#4F7CFF]/25 hover:scale-105 active:scale-95 transition-transform"
            >
              <Headphones className="w-9 h-9" />
            </button>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {isMl ? 'ബട്ടണിൽ തൊട്ട് ശബ്ദം കേൾക്കുക, വാക്ക് കണ്ടെത്തുക' : 'Tap the audio button, listen carefully and choose the word'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pictureOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentWord.word;

              let btnStyle = 'border-slate-200 hover:border-[#4F7CFF] bg-slate-50/50 text-slate-800';
              if (hasAnswered) {
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
                  disabled={hasAnswered}
                  onClick={() => handleAnswerSubmit(opt, isCorrect)}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all text-center ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-pop">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">
                  {currentWord.word} — {currentWord.malayalam}
                </span>
                <span className="text-slate-400 font-mono">{currentWord.phonetic}</span>
              </div>
              <p className="text-slate-600 font-malayalam">{currentWord.exampleEn} ({currentWord.exampleMl})</p>
              <button
                onClick={handleNextWord}
                className="w-full mt-2 py-3 rounded-xl bg-[#4F7CFF] text-white font-bold text-sm shadow-md"
              >
                {isMl ? 'അടുത്ത വാക്ക്' : 'Next Word'} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 6: DICTIONARY EXPLORER (ALL 52 WORDS) */}
      {activeMode === 'explorer' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMl ? 'വാക്കുകൾ തിരയുക...' : 'Search English or Malayalam...'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {['All', 'Greetings', 'Family', 'Food', 'Places', 'Actions', 'Emotions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#4F7CFF]/50 bg-white shadow-xs hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{word.emoji}</span>
                  <button
                    onClick={() => handlePlayWordAudio(word.word, word.id)}
                    className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-[#4F7CFF] text-[#4F7CFF] group-hover:text-white flex items-center justify-center transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 className={`w-4 h-4 ${audioActiveId === word.id ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {word.word}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {word.phonetic}
                  </div>
                  <div className="text-xs font-bold text-[#8055E8] font-malayalam mt-1">
                    {word.malayalam}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                  <p className="italic">"{word.exampleEn}"</p>
                  <p className="text-slate-400 font-malayalam mt-0.5">{word.exampleMl}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
