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
  Send, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Award,
  BookOpen,
  ChevronRight,
  Info
} from 'lucide-react';

interface SpeakingArenaProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  malayalamExplanation?: string;
  suggestedReplies?: string[];
  timestamp: string;
}

async function readApiJson<T = Record<string, any>>(response: Response, fallbackMessage: string): Promise<T> {
  const raw = await response.text();
  let data: any = null;

  if (raw.trim()) {
    try {
      data = JSON.parse(raw);
    } catch {
      const detail = raw.trim().replace(/\\s+/g, ' ').slice(0, 180);
      throw new Error(response.ok
        ? 'The AI server returned an invalid response. Please try again.'
        : `${fallbackMessage} (HTTP ${response.status})${detail ? `: ${detail}` : ''}`);
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || `${fallbackMessage} (HTTP ${response.status})`);
  }
  if (!data || typeof data !== 'object') {
    throw new Error('The AI server returned an empty response. Please try again.');
  }
  return data as T;
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

export const SpeakingArena: React.FC<SpeakingArenaProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const isMl = progress.lang === 'ml';

  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario>(SPEAKING_SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [expandedMlIds, setExpandedMlIds] = useState<Record<string, boolean>>({});
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);

  // Feedback report state
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState<boolean>(false);
  const [feedbackReport, setFeedbackReport] = useState<SpeakingFeedbackData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize scenario conversation
  useEffect(() => {
    const starterMsg: ChatMessage = {
      id: 'msg_0',
      sender: 'ai',
      text: selectedScenario.starterMessageEn,
      malayalamExplanation: selectedScenario.starterMessageMl,
      suggestedReplies: selectedScenario.suggestedStarters,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([starterMsg]);
    setExpandedMlIds({ msg_0: true }); // Open first Malayalam translation for convenience
    setFeedbackReport(null);
    setInputText('');
  }, [selectedScenario]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAI]);

  // Handle Play English Audio
  const handlePlayAudio = (text: string, id: string) => {
    setAudioPlayingId(id);
    speakText(text, 'en-US', () => setAudioPlayingId(null));
  };

  // Toggle speech recording
  const handleToggleRecord = () => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
      return;
    }

    setRecordingError(null);
    const stopFn = startSpeechRecognition({
      onStart: () => {
        setIsRecording(true);
      },
      onResult: (transcript: string, isFinal: boolean) => {
        setInputText(transcript);
        if (isFinal) {
          setIsRecording(false);
        }
      },
      onError: (err: string) => {
        setIsRecording(false);
        setRecordingError(err);
      },
      onEnd: () => {
        setIsRecording(false);
      }
    });
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoadingAI) return;

    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoadingAI(true);

    try {
      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.titleEn,
          scenarioDescription: selectedScenario.descriptionEn,
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          userLevel: progress.selectedLevel || 'Beginner'
        })
      });

      const data = await readApiJson(res, 'AI conversation is temporarily unavailable.');
      const aiReply = data.reply || (data.fallback && data.fallback.reply) || "That's very interesting! Tell me more.";
      const aiMl = data.malayalamExplanation || (data.fallback && data.fallback.malayalamExplanation) || "അത് വളരെ നല്ലതാണ്! കൂടുതൽ പറയാമോ?";
      const aiSuggestions = data.suggestedReplies || (data.fallback && data.fallback.suggestedReplies) || [];

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        malayalamExplanation: aiMl,
        suggestedReplies: aiSuggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      // Play AI speech automatically for interactive feel
      handlePlayAudio(aiReply, aiMsg.id);

      // Track speaking practice minutes (+1 min every 2 turns)
      onUpdateProgress((prev) => ({
        ...prev,
        speakingMinutes: prev.speakingMinutes + 1,
        xp: prev.xp + 10,
        level: Math.floor((prev.xp + 10) / 100) + 1
      }));
    } catch (e: any) {
      console.error('Failed to get conversation response:', e);
      setRecordingError(e?.message || (isMl
        ? 'AI സംഭാഷണം ഇപ്പോൾ ലഭ്യമല്ല. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.'
        : 'AI conversation is currently unavailable. Please try again shortly.'));
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Generate diagnostic feedback report
  const handleEndSessionAndGetFeedback = async () => {
    setIsGeneratingFeedback(true);
    try {
      const res = await fetch('/api/ai/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.titleEn,
          messages: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await readApiJson<SpeakingFeedbackData>(res, 'Speaking feedback is temporarily unavailable.');
      setFeedbackReport(data);
      triggerRewardEffect(true);

      // Save speaking history entry
      onUpdateProgress((prev) => {
        const historyEntry = {
          id: `speak_${Date.now()}`,
          date: new Date().toLocaleDateString(),
          scenarioTitle: selectedScenario.titleEn,
          score: data.overallScore || 80,
          turnsCount: messages.filter((m) => m.sender === 'user').length
        };
        const newXp = prev.xp + 30;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          coins: prev.coins + 10,
          speakingHistory: [historyEntry, ...prev.speakingHistory].slice(0, 20)
        };
      });
    } catch (e: any) {
      console.error('Failed to get feedback report:', e);
      setFeedbackReport(null);
      setRecordingError(e?.message || (isMl
        ? 'സംസാര വിലയിരുത്തൽ ഇപ്പോൾ ലഭ്യമല്ല. വീണ്ടും ശ്രമിക്കുക.'
        : 'Speaking assessment is currently unavailable. Please try again.'));
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F7CFF] bg-blue-50 px-2.5 py-1 rounded-lg">
            {isMl ? 'യഥാർത്ഥ AI സംഭാഷണ പങ്കാളി' : 'AI Conversation Partner'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            {isMl ? 'സ്പീക്കിംഗ് അരീന (Speaking Arena)' : 'Speaking Arena'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-malayalam mt-1">
            {isMl
              ? 'മൈക്രോഫോണിലൂടെയോ എഴുതിയോ ഇംഗ്ലീഷിൽ സംസാരിക്കാം. ഓരോ വാക്യത്തിനും മലയാള തർജ്ജമയും ലഭിക്കും.'
              : 'Speak or type with your AI English partner. Get audio pronunciation, Malayalam translations, and instant diagnostic feedback.'}
          </p>
        </div>

        {/* End Session CTA */}
        <button
          onClick={handleEndSessionAndGetFeedback}
          disabled={messages.filter((m) => m.sender === 'user').length === 0 || isGeneratingFeedback}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 ${
            messages.filter((m) => m.sender === 'user').length > 0
              ? 'bg-[#37D6A0] hover:bg-[#2ec28f] text-slate-950 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isGeneratingFeedback ? (isMl ? 'വിലയിരുത്തുന്നു...' : 'Analyzing...') : (isMl ? 'പരിശീലന ഫലം കാണുക' : 'Get AI Feedback')}</span>
        </button>
      </div>

      {/* Scenario Selector Horizontal Carousel */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {SPEAKING_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'border-[#4F7CFF] bg-blue-50/90 text-[#4F7CFF] shadow-sm ring-2 ring-[#4F7CFF]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-base">{sc.emoji}</span>
              <span className={isMl ? 'font-malayalam' : ''}>
                {isMl ? sc.titleMl : sc.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Conversation Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Scenario Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedScenario.emoji}</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {isMl ? selectedScenario.titleMl : selectedScenario.titleEn}
              </h3>
              <p className="text-[11px] text-slate-500 font-malayalam">
                {isMl ? selectedScenario.partnerRoleMl : selectedScenario.partnerRoleEn}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {messages.filter((m) => m.sender === 'user').length} {isMl ? 'മറുപടികൾ' : 'turns'}
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            const isMlExpanded = !!expandedMlIds[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-2 shadow-xs ${
                    isAI
                      ? 'bg-slate-100/90 text-slate-900 rounded-tl-sm'
                      : 'bg-[#4F7CFF] text-white rounded-tr-sm'
                  }`}
                >
                  {/* Message Text with Audio Button */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base leading-relaxed font-medium">
                      {msg.text}
                    </p>
                    <button
                      onClick={() => handlePlayAudio(msg.text, msg.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                        isAI
                          ? 'bg-white hover:bg-slate-200 text-slate-700'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                      title="Listen audio / ഉച്ചാരണം കേൾക്കാം"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${audioPlayingId === msg.id ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>

                  {/* Malayalam translation collapsible for AI messages */}
                  {isAI && msg.malayalamExplanation && (
                    <div className="pt-2 border-t border-slate-200/70">
                      <button
                        onClick={() =>
                          setExpandedMlIds((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className="text-[11px] font-bold text-[#4F7CFF] hover:underline flex items-center gap-1 font-malayalam"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>
                          {isMlExpanded ? 'മലയാളം ഒളിപ്പിക്കുക' : 'മലയാളം തർജ്ജമ കാണുക'}
                        </span>
                      </button>

                      {isMlExpanded && (
                        <p className="text-xs text-slate-600 font-malayalam mt-1.5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/50">
                          {msg.malayalamExplanation}
                        </p>
                      )}
                    </div>
                  )}

                  <div className={`text-[10px] text-right font-mono ${isAI ? 'text-slate-400' : 'text-blue-100'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggested Reply Chips for beginners */}
                {isAI && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="mt-2 space-y-1 max-w-[85%]">
                    <span className="text-[11px] font-bold text-slate-400 font-malayalam block pl-1">
                      {isMl ? 'തുടക്കക്കാർക്കുള്ള നിർദ്ദേശങ്ങൾ (Tap to reply):' : 'Suggested responses for beginners:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSendMessage(reply)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#4F7CFF] hover:bg-blue-50/50 text-slate-700 hover:text-[#4F7CFF] text-xs font-medium text-left transition-all active:scale-95 shadow-xs"
                        >
                          "{reply}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isLoadingAI && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 text-slate-400 rounded-2xl w-fit text-xs animate-pulse">
              <Sparkles className="w-4 h-4 text-[#4F7CFF] animate-spin-slow" />
              <span>{isMl ? 'AI പങ്കാളി ചിന്തിക്കുന്നു...' : 'AI partner is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Recording error alert */}
        {recordingError && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{recordingError}</span>
            </div>
            <button
              onClick={() => setRecordingError(null)}
              className="font-bold text-amber-800 text-xs ml-2 hover:underline"
            >
              OK
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {/* Microphone Button */}
            <button
              onClick={handleToggleRecord}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 active:scale-90 shadow-md ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white'
              }`}
              title={isRecording ? 'Stop listening' : 'Start microphone speech'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Fallback */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                isRecording
                  ? (isMl ? 'കേൾക്കുന്നു... സംസാരിക്കൂ...' : 'Listening... speak clearly...')
                  : (isMl ? 'മൈക്കിലൂടെ സംസാരിക്കുക അല്ലെങ്കിൽ ഇവിടെ ടൈപ്പ് ചെയ്യുക...' : 'Speak into mic or type your reply...')
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] bg-white text-slate-900 text-sm font-medium shadow-inner"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoadingAI}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-md ${
                inputText.trim() && !isLoadingAI
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>
              {isRecording
                ? (isMl ? '🔴 മൈക്ക് ഓണാണ് (സംസാരിച്ചു കഴിഞ്ഞാൽ തനിയെ തിരിച്ചറിയും)' : '🔴 Recording active (Listening to your speech)')
                : (isMl ? 'മൈക്ക് ലഭ്യമല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യാം' : 'Microphone & keyboard supported')}
            </span>
            <span className="font-malayalam">
              {isMl ? 'പരിശീലന ശേഷം "AI Feedback" ബട്ടൺ അമർത്തുക' : 'Tap "Get AI Feedback" anytime'}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostic Feedback Modal */}
      {feedbackReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 p-6 sm:p-8 space-y-6 animate-pop">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#37D6A0] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {isMl ? 'സംസാര മൂല്യനിർണ്ണയം' : 'Speaking Diagnostic Report'}
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

            {/* Transcription disclaimer notice as requested in prompt */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>{isMl ? 'ശ്രദ്ധിക്കുക:' : 'Notice:'}</strong>{' '}
                {feedbackReport.transcriptionNote ||
                  'This evaluation is based on text transcription from your speech. Keep practicing speaking clearly with natural pauses.'}
              </p>
            </div>

            {/* Diagnostic Categories */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Grammar Feedback:</span>
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
                  <span>Fluency Advice:</span>
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

              {/* Suggested Practice Sentences with Audio */}
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
                        onClick={() => handlePlayAudio(sentence, `practice_${sIdx}`)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-[#4F7CFF] flex items-center justify-center shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setFeedbackReport(null)}
              className="w-full py-3.5 rounded-xl bg-[#4F7CFF] hover:bg-[#3E6DE8] text-white font-bold text-sm shadow-md"
            >
              {isMl ? 'പരിശീലനത്തിലേക്ക് മടങ്ങുക' : 'Done & Return to Arena'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
