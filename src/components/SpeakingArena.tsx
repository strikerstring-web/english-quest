import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, SpeakingScenario } from '../types';
import { SPEAKING_SCENARIOS } from '../data/scenarios';
import { 
  startSpeechRecognition, 
  stopSpeechRecognition, 
  isSpeechRecognitionSupported, 
  speakText, 
  stopSpeech 
} from '../utils/speech';
import { triggerRewardEffect } from '../utils/storage';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  PhoneCall, 
  PhoneOff, 
  Radio, 
  Info, 
  Languages, 
  ChevronRight,
  BookOpen,
  VolumeX
} from 'lucide-react';

interface SpeakingArenaProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

interface SpokenTurn {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  malayalamTranslation?: string;
  timestamp: string;
}

interface SpeakingFeedbackData {
  overallScore: number;
  grammarFeedback: string;
  vocabularyFeedback: string;
  sentenceImprovement: string;
  fluencyTip: string;
  malayalamSummary: string;
  suggestedPractice: string[];
  transcriptionNote: string;
}

type LocalReply = { reply: string; malayalam: string; suggestions: string[] };

function createLocalConversationReply(userText: string, scenario: SpeakingScenario, turn: number): LocalReply {
  const text = userText.toLowerCase();
  const name = text.match(/my name is ([a-z]+)/)?.[1];
  const templates: Array<{ test: RegExp; replies: string[]; ml: string; suggestions: string[] }> = [
    { 
      test: /\b(name|called|myself)\b/, 
      replies: [
        `Nice to meet you, ${name ? name[0].toUpperCase() + name.slice(1) : 'my friend'}! Where are you from in Kerala?`,
        'That is a wonderful name! What do you like to do every day?'
      ], 
      ml: 'നിങ്ങളെ പരിചയപ്പെട്ടതിൽ സന്തോഷം! കേരളത്തിൽ എവിടെ നിന്നാണ് വരുന്നത്?', 
      suggestions: ['I am from Kochi.', 'I live in Kozhikode.', 'I enjoy learning English every day.'] 
    },
    { 
      test: /\b(father|mother|brother|sister|family|parents|home)\b/, 
      replies: [
        'That sounds wonderful. Tell me more about your family members!',
        'Family is so special. What do you usually do together on weekends?'
      ], 
      ml: 'വളരെ നല്ലത്. നിങ്ങളുടെ കുടുംബാംഗങ്ങളെക്കുറിച്ച് കൂടുതൽ പറയാമോ?', 
      suggestions: ['There are four members in my family.', 'My mother is a good cook.', 'We spend time together on Sundays.'] 
    },
    { 
      test: /\b(college|school|class|teacher|study|student|course|learn)\b/, 
      replies: [
        'That is great! What is your favourite subject to study?',
        'Education is very important. What are you planning to do after your studies?'
      ], 
      ml: 'അത് കൊള്ളാം! നിങ്ങൾക്ക് ഏറ്റവും ഇഷ്ടപ്പെട്ട വിഷയം ഏതാണ്?', 
      suggestions: ['I like English and science.', 'I am studying for my exams.', 'My teachers are very helpful.'] 
    },
    { 
      test: /\b(food|eat|rice|tea|coffee|curry|hungry|lunch|breakfast)\b/, 
      replies: [
        'Delicious! Kerala food is famous. Do you enjoy cooking or trying new dishes?',
        'Hot tea is the best! What is your favourite dish to eat with family?'
      ], 
      ml: 'രുചികരമായ ഭക്ഷണം! നിങ്ങൾക്ക് പാചകം ചെയ്യാനും ഇഷ്ടമാണോ?', 
      suggestions: ['I love hot Kerala tea.', 'My favourite food is biryani.', 'I eat rice and curry for lunch.'] 
    },
    { 
      test: /\b(shop|buy|price|cost|money|rupees|packet|store|market)\b/, 
      replies: [
        'Certainly! We have fresh items today. Would you like to check the smaller size?',
        'That costs 50 rupees. Would you like to pay with cash or Google Pay?'
      ], 
      ml: 'തീർച്ചയായും! ഇതിന് 50 രൂപയാണ് വില. പണമായി നൽകണോ അതോ GPay ചെയ്യണോ?', 
      suggestions: ['How much does this cost?', 'Can I pay using Google Pay?', 'Do you have another colour?'] 
    },
    { 
      test: /\b(direction|way|road|station|bus|hospital|where|far)\b/, 
      replies: [
        'Go straight along this road and take the first left turn. It is just 5 minutes away!',
        'Yes, it is very close! Walk past the traffic signal and you will see it.'
      ], 
      ml: 'ഈ വഴി നേരെ പോയി ആദ്യത്തെ ഇടത്തേക്ക് തിരിയുക. വെറും 5 മിനിറ്റ് ദൂരമേ ഉള്ളൂ!', 
      suggestions: ['Is the bus stop near here?', 'How far is the railway station?', 'Thank you for your guidance.'] 
    },
    { 
      test: /\b(wake|morning|routine|evening|night|sleep|work|daily)\b/, 
      replies: [
        'A good daily routine keeps you healthy and energetic. What do you do in the evening?',
        'Waking up early is great! Do you like to go for morning walks?'
      ], 
      ml: 'നല്ലൊരു ദിനചര്യ ആരോഗ്യത്തിന് നല്ലതാണ്. വൈകുന്നേരം എന്താണ് ചെയ്യാറുള്ളത്?', 
      suggestions: ['I wake up at six in the morning.', 'I go for an evening walk.', 'I sleep early at night.'] 
    }
  ];

  const matched = templates.find((item) => item.test.test(text));
  const generic = [
    { 
      reply: 'That is very interesting! Could you tell me a little more about that?', 
      malayalam: 'അത് വളരെ രസകരമാണ്! അതിനെക്കുറിച്ച് കുറച്ചുകൂടി പറയാമോ?', 
      suggestions: ['Yes, I would be happy to explain.', 'It helps me improve my English.', 'I enjoy this very much.'] 
    },
    { 
      reply: 'You are speaking clearly! How do you feel about practicing English today?', 
      malayalam: 'നിങ്ങൾ വ്യക്തമായി സംസാരിക്കുന്നുണ്ട്! ഇന്ന് ഇംഗ്ലീഷ് സംസാരിക്കുമ്പോൾ എന്ത് തോന്നുന്നു?', 
      suggestions: ['I feel happy and confident.', 'I want to speak fluently.', 'Thank you for helping me.'] 
    },
    { 
      reply: 'Great answer! What is something new you learned recently?', 
      malayalam: 'നല്ല മറുപടി! അടുത്തിടെ നിങ്ങൾ പഠിച്ച പുതിയൊരു കാര്യം എന്താണ്?', 
      suggestions: ['I learned many new words.', 'I am practicing short sentences.', 'I speak English every day.'] 
    }
  ];

  if (matched) return { reply: matched.replies[turn % matched.replies.length], malayalam: matched.ml, suggestions: matched.suggestions };
  return generic[turn % generic.length];
}

function createLocalSpeakingFeedback(history: SpokenTurn[], isMl: boolean): SpeakingFeedbackData {
  const userTurns = history.filter((turn) => turn.speaker === 'user');
  const allWords = userTurns.map((t) => t.text).join(' ').trim().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(allWords.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')));
  
  const score = Math.max(55, Math.min(96, 60 + Math.min(userTurns.length * 8, 20) + Math.min(uniqueWords.size * 2, 16)));
  const sample = userTurns[0]?.text || 'I want to speak English fluently.';

  return {
    overallScore: score,
    grammarFeedback: userTurns.length >= 2 
      ? 'Good subject-verb usage! Continue focusing on clear pronouns (He, She, They) and prepositions (to, in, at).'
      : 'Try expanding your speech into complete sentences like "I am from Kerala" instead of one-word answers.',
    vocabularyFeedback: uniqueWords.size >= 8
      ? 'You used a good set of natural conversational words suitable for everyday dialogues.'
      : 'Great start! Practice incorporating everyday action words into your conversation.',
    sentenceImprovement: `Instead of "${sample}", try saying: "${sample.endsWith('.') ? sample : sample + '.'} It is very enjoyable to speak English."`,
    fluencyTip: 'Practice speaking in short, relaxed breath groups. Repeat each spoken answer twice to build effortless confidence.',
    malayalamSummary: isMl 
      ? 'വളരെ നല്ല സംഭാഷണ മുന്നേറ്റം! ദിവസവും ഏതാനും മിനിറ്റുകൾ ഉറക്കെ സംസാരിച്ച് ശീലിക്കുന്നത് വഴി സംസാരത്തിലെ മടി പൂർണ്ണമായും മാറും.'
      : 'Excellent speaking session! Practicing aloud daily will build automatic conversational confidence and smooth fluency.',
    suggestedPractice: [
      'I am speaking English with confidence today.',
      'Could you please tell me more about that?',
      'Thank you, I really enjoyed our conversation.'
    ],
    transcriptionNote: 'This practice diagnostic is based on speech recognition transcription. Focus on relaxed, natural pronunciation.'
  };
}

export const SpeakingArena: React.FC<SpeakingArenaProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';

  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario>(SPEAKING_SCENARIOS[0]);
  
  // Call session states
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isCallActive, setIsCallActive] = useState<boolean>(true);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);
  const [showMalayalamExplanation, setShowMalayalamExplanation] = useState<boolean>(true);
  
  // Conversation History
  const [conversationTurns, setConversationTurns] = useState<SpokenTurn[]>([]);
  const [currentAIReply, setCurrentAIReply] = useState<{
    text: string;
    malayalam: string;
    suggestions: string[];
  }>({
    text: selectedScenario.starterMessageEn,
    malayalam: selectedScenario.starterMessageMl,
    suggestions: selectedScenario.suggestedStarters
  });

  // Diagnostic feedback modal state
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState<boolean>(false);
  const [feedbackReport, setFeedbackReport] = useState<SpeakingFeedbackData | null>(null);

  // Timer for call duration
  useEffect(() => {
    let interval: any = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Initial greeting when scenario changes
  useEffect(() => {
    stopSpeech();
    stopSpeechRecognition();
    setIsRecording(false);
    setLiveTranscript('');
    setCallDuration(0);
    setIsCallActive(true);
    setFeedbackReport(null);

    const initialAI = {
      text: selectedScenario.starterMessageEn,
      malayalam: selectedScenario.starterMessageMl,
      suggestions: selectedScenario.suggestedStarters
    };
    setCurrentAIReply(initialAI);
    setConversationTurns([
      {
        id: `turn_0`,
        speaker: 'ai',
        text: initialAI.text,
        malayalamTranslation: initialAI.malayalam,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Speak initial AI line
    setIsAISpeaking(true);
    speakText(initialAI.text, 'en-US', () => {
      setIsAISpeaking(false);
    });
  }, [selectedScenario]);

  // Format call timer (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play / Replay current AI line
  const handleReplayAI = () => {
    stopSpeech();
    setIsAISpeaking(true);
    speakText(currentAIReply.text, 'en-US', () => {
      setIsAISpeaking(false);
    });
  };

  // Toggle user voice recording
  const handleToggleMic = () => {
    if (isAISpeaking) {
      stopSpeech();
      setIsAISpeaking(false);
    }

    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
      if (liveTranscript.trim()) {
        processUserSpeech(liveTranscript.trim());
      }
      return;
    }

    setMicError(null);
    setLiveTranscript('');
    
    startSpeechRecognition({
      onStart: () => {
        setIsRecording(true);
      },
      onResult: (transcript: string, isFinal: boolean) => {
        setLiveTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setIsRecording(false);
          processUserSpeech(transcript.trim());
        }
      },
      onError: (err: string) => {
        setIsRecording(false);
        setMicError(err);
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });
  };

  // Process user speech and get immediate AI voice reply
  const processUserSpeech = (spokenText: string) => {
    if (!spokenText.trim()) return;

    const userTurn: SpokenTurn = {
      id: `turn_${Date.now()}`,
      speaker: 'user',
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...conversationTurns, userTurn];
    setConversationTurns(updatedHistory);
    setLiveTranscript('');

    // Generate response
    const replyTurnIndex = updatedHistory.filter((t) => t.speaker === 'user').length;
    const aiResponse = createLocalConversationReply(spokenText, selectedScenario, replyTurnIndex);

    const aiTurn: SpokenTurn = {
      id: `turn_${Date.now() + 1}`,
      speaker: 'ai',
      text: aiResponse.reply,
      malayalamTranslation: aiResponse.malayalam,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCurrentAIReply({
      text: aiResponse.reply,
      malayalam: aiResponse.malayalam,
      suggestions: aiResponse.suggestions
    });
    setConversationTurns([...updatedHistory, aiTurn]);

    // Speak aloud automatically
    setIsAISpeaking(true);
    speakText(aiResponse.reply, 'en-US', () => {
      setIsAISpeaking(false);
    });

    // Update progress minutes and XP
    onUpdateProgress((prev) => ({
      ...prev,
      speakingMinutes: prev.speakingMinutes + 1,
      xp: prev.xp + 15,
      level: Math.floor((prev.xp + 15) / 100) + 1
    }));
  };

  // Beginner prompt suggestion tapped
  const handleSelectSuggestedReply = (suggestedPhrase: string) => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    }
    processUserSpeech(suggestedPhrase);
  };

  // End Call & View Diagnostic Feedback
  const handleEndCall = () => {
    stopSpeech();
    stopSpeechRecognition();
    setIsRecording(false);
    setIsAISpeaking(false);
    setIsCallActive(false);

    setIsGeneratingFeedback(true);
    const feedback = createLocalSpeakingFeedback(conversationTurns, isMl);
    setFeedbackReport(feedback);
    triggerRewardEffect(true);

    onUpdateProgress((prev) => {
      const entry = {
        id: `speak_${Date.now()}`,
        date: new Date().toLocaleDateString(),
        scenarioTitle: selectedScenario.titleEn,
        score: feedback.overallScore,
        turnsCount: conversationTurns.filter((t) => t.speaker === 'user').length
      };
      const newXp = prev.xp + 30;
      const newLevel = Math.floor(newXp / 100) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        coins: prev.coins + 10,
        speakingHistory: [entry, ...prev.speakingHistory].slice(0, 20)
      };
    });
    setIsGeneratingFeedback(false);
  };

  const userSpokenTurnsCount = conversationTurns.filter((t) => t.speaker === 'user').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Scenario Ribbon */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        {SPEAKING_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
              }`}
            >
              <span>{sc.emoji}</span>
              <span className={isMl ? 'font-malayalam' : ''}>
                {isMl ? sc.titleMl : sc.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* DIRECT VOICE CONVERSATION INTERFACE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#111827] to-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-between min-h-[580px]">
        {/* Top Call Info Bar */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-400">
                <Radio className="w-3.5 h-3.5" />
                <span>{isMl ? 'തത്സമയ സംഭാഷണം (Live Voice Call)' : 'Live Voice Call'}</span>
              </div>
              <h2 className="text-sm font-extrabold text-white mt-0.5">
                {isMl ? selectedScenario.titleMl : selectedScenario.titleEn} · {selectedScenario.partnerRoleEn}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-mono tabular-nums text-slate-300">
              {formatTime(callDuration)}
            </div>
            
            <button
              onClick={handleEndCall}
              disabled={userSpokenTurnsCount === 0}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                userSpokenTurnsCount > 0
                  ? 'bg-red-500 hover:bg-red-600 text-white active:scale-95'
                  : 'bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
              title="End conversation and see diagnostic feedback"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>{isMl ? 'കോൾ അവസാനിപ്പിക്കുക' : 'End Call'}</span>
            </button>
          </div>
        </div>

        {/* Center Visualizer: AI Partner Voice Orb & Live Waveform */}
        <div className="my-6 flex flex-col items-center text-center space-y-4 max-w-lg w-full">
          {/* Animated Avatar Sphere with Dynamic Pulse Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outermost Ripple */}
            <div className={`absolute w-44 h-44 rounded-full transition-all duration-700 ${
              isAISpeaking
                ? 'bg-[#4F7CFF]/20 scale-125 animate-pulse'
                : isRecording
                ? 'bg-red-500/25 scale-125 animate-ping'
                : 'bg-white/5 scale-100'
            }`} />

            {/* Middle Ripple */}
            <div className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
              isAISpeaking
                ? 'bg-[#8055E8]/30 scale-110'
                : isRecording
                ? 'bg-red-500/35 scale-110'
                : 'bg-white/10 scale-100'
            }`} />

            {/* Core Avatar Button */}
            <div className={`relative w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl transition-all duration-300 ${
              isAISpeaking
                ? 'bg-gradient-to-tr from-[#4F7CFF] via-[#8055E8] to-[#37D6A0] scale-105 ring-4 ring-white/40'
                : isRecording
                ? 'bg-gradient-to-tr from-red-600 to-amber-600 scale-105 ring-4 ring-red-400'
                : 'bg-gradient-to-tr from-slate-800 to-slate-700 ring-2 ring-white/20'
            }`}>
              <span>{selectedScenario.emoji}</span>
            </div>
          </div>

          {/* Voice State Badge */}
          <div className="pt-2">
            {isAISpeaking ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-[#4F7CFF] text-xs font-bold animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{selectedScenario.partnerRoleEn} is speaking...</span>
              </div>
            ) : isRecording ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-400 text-xs font-bold animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                <span>{isMl ? 'കേൾക്കുന്നു... ഇംഗ്ലീഷിൽ സംസാരിക്കൂ...' : 'Listening to you... Speak in English'}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>{isMl ? 'നിങ്ങളുടെ ഊഴം: മൈക്കിൽ തൊട്ട് സംസാരിക്കൂ' : 'Your Turn: Tap the microphone to talk'}</span>
              </div>
            )}
          </div>

          {/* Live Closed Caption / Spoken Sentence */}
          <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 shadow-inner">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed text-left">
                "{currentAIReply.text}"
              </p>
              <button
                onClick={handleReplayAI}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-transform active:scale-90"
                title="Hear sentence again / വീണ്ടും കേൾക്കാം"
              >
                <Volume2 className={`w-4 h-4 ${isAISpeaking ? 'text-[#37D6A0] animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Malayalam Translation Card */}
            {showMalayalamExplanation && currentAIReply.malayalam && (
              <div className="pt-2 border-t border-white/10 text-left font-malayalam">
                <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-amber-400 font-bold mr-1.5">മലയാള അർത്ഥം:</span>
                  {currentAIReply.malayalam}
                </p>
              </div>
            )}

            {/* Live user speech caption preview when recording */}
            {liveTranscript && (
              <div className="pt-2 border-t border-red-500/30 text-left animate-pop">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                  You are saying:
                </span>
                <p className="text-sm text-red-200 font-semibold italic mt-0.5">
                  "{liveTranscript}"
                </p>
              </div>
            )}
          </div>

          {/* Beginner Spoken Prompt Suggestions ("Say this" cards) */}
          <div className="w-full text-left space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold font-malayalam text-[11px] text-slate-300">
                {isMl ? 'നിങ്ങൾക്ക് പറയാവുന്ന മറുപടികൾ (Tap to speak):' : 'Suggested phrases you can say:'}
              </span>
              <button
                onClick={() => setShowMalayalamExplanation(!showMalayalamExplanation)}
                className="text-[11px] text-[#4F7CFF] hover:underline flex items-center gap-1"
              >
                <Languages className="w-3 h-3" />
                <span>{showMalayalamExplanation ? 'Hide Malayalam' : 'Show Malayalam'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {currentAIReply.suggestions.slice(0, 3).map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSelectSuggestedReply(suggestion)}
                  className="flex-1 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-[#4F7CFF] text-left text-xs font-semibold text-white/90 hover:text-white transition-all active:scale-95"
                >
                  <span className="text-[#37D6A0] text-[10px] uppercase font-bold block mb-0.5">
                    Say this 🗣️
                  </span>
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error notification */}
        {micError && (
          <div className="w-full max-w-lg p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{micError}</span>
            </div>
            <button
              onClick={() => setMicError(null)}
              className="text-xs font-bold text-white underline ml-2"
            >
              OK
            </button>
          </div>
        )}

        {/* Bottom Voice Call Action Deck */}
        <div className="w-full max-w-md pt-4 flex flex-col items-center space-y-3">
          {/* Main Push-To-Talk Microphone Circle */}
          <button
            onClick={handleToggleMic}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 ${
              isRecording
                ? 'bg-red-500 text-white ring-8 ring-red-500/40 animate-pulse scale-110'
                : 'bg-gradient-to-tr from-[#4F7CFF] to-[#8055E8] hover:from-[#3E6DE8] hover:to-[#6E42E5] text-white ring-4 ring-white/20 hover:scale-105'
            }`}
            title={isRecording ? 'Tap to finish speaking' : 'Tap to speak'}
          >
            {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
          </button>

          <div className="text-center">
            <span className="text-xs font-bold tracking-wide uppercase text-white block">
              {isRecording 
                ? (isMl ? 'സംസാരിച്ച് കഴിഞ്ഞാൽ വീണ്ടും അമർത്തുക' : 'Tap to Send Your Speech')
                : (isMl ? 'സംസാരിക്കാൻ മൈക്കിൽ തൊടുക' : 'Tap to Speak English')}
            </span>
            <span className="text-[11px] text-slate-400 font-malayalam block mt-0.5">
              {userSpokenTurnsCount} {isMl ? 'തവണ സംസാരിച്ചു' : 'spoken turns in this call'}
            </span>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#4F7CFF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#8055E8]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Diagnostic Feedback Modal */}
      {feedbackReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 p-6 sm:p-8 space-y-6 animate-pop text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#37D6A0] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {isMl ? 'സംസാര പരിശീലന ഫലം' : 'Voice Call Feedback Report'}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedScenario.titleEn}
                </h2>
              </div>
              <div className="text-center bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl">
                <div className="text-2xl font-black text-[#4F7CFF] tabular-nums">
                  {feedbackReport.overallScore}/100
                </div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">
                  {isMl ? 'സ്കോർ' : 'Score'}
                </div>
              </div>
            </div>

            {/* Disclaimer notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>{isMl ? 'ശ്രദ്ധിക്കുക:' : 'Notice:'}</strong>{' '}
                {feedbackReport.transcriptionNote}
              </p>
            </div>

            {/* Diagnostic Categories */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Grammar Guidance:</span>
                </div>
                <p className="text-slate-600 pl-5">{feedbackReport.grammarFeedback}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#4F7CFF]" />
                  <span>Vocabulary Feedback:</span>
                </div>
                <p className="text-slate-600 pl-5">{feedbackReport.vocabularyFeedback}</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4F7CFF]" />
                  <span>Sentence Improvement:</span>
                </div>
                <p className="text-blue-950 pl-5 font-medium">{feedbackReport.sentenceImprovement}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#8055E8]" />
                  <span>Fluency Practice Tip:</span>
                </div>
                <p className="text-purple-950 pl-5">{feedbackReport.fluencyTip}</p>
              </div>

              {/* Malayalam Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 font-malayalam">
                <div className="font-bold text-emerald-900">
                  {isMl ? 'മലയാള വിലയിരുത്തൽ ചുരുക്കം:' : 'Malayalam Summary & Encouragement:'}
                </div>
                <p className="text-emerald-950 leading-relaxed">{feedbackReport.malayalamSummary}</p>
              </div>

              {/* Practice Sentences with Audio */}
              {feedbackReport.suggestedPractice && feedbackReport.suggestedPractice.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-slate-900 text-xs block">
                    {isMl ? 'പരിശീലിക്കാവുന്ന വാക്യങ്ങൾ (Listen & Repeat):' : 'Suggested Practice Sentences:'}
                  </span>
                  {feedbackReport.suggestedPractice.map((sentence, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-medium text-slate-800">"{sentence}"</span>
                      <button
                        onClick={() => speakText(sentence, 'en-US')}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-[#4F7CFF] flex items-center justify-center shrink-0 hover:bg-blue-50"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFeedbackReport(null);
                setIsCallActive(true);
              }}
              className="w-full py-3.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              {isMl ? 'പുതിയ സംഭാഷണം തുടങ്ങുക' : 'Start Another Conversation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
