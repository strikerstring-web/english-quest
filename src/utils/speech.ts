// Speech Recognition and Speech Synthesis Utilities

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export interface SpeechRecognitionListener {
  onStart?: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

let activeRecognition: any = null;

export function startSpeechRecognition(
  listener: SpeechRecognitionListener,
  lang: string = 'en-US'
): () => void {
  if (!isSpeechRecognitionSupported()) {
    listener.onError?.('Speech recognition is not supported in this browser. Please type your message.');
    return () => {};
  }

  try {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listener.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (finalTranscript) {
        listener.onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        listener.onResult(interimTranscript.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      let message = 'Microphone error.';
      if (event.error === 'not-allowed') {
        message = 'Microphone permission denied. Please allow microphone access or use text input.';
      } else if (event.error === 'no-speech') {
        message = 'No speech detected. Please speak clearly into the microphone.';
      } else if (event.error === 'network') {
        message = 'Network error during speech recognition.';
      }
      listener.onError?.(message);
    };

    recognition.onend = () => {
      listener.onEnd?.();
      activeRecognition = null;
    };

    activeRecognition = recognition;
    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
      activeRecognition = null;
    };
  } catch (err: any) {
    listener.onError?.(err?.message || 'Failed to start microphone recognition.');
    return () => {};
  }
}

export function stopSpeechRecognition() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      // ignore
    }
    activeRecognition = null;
  }
}

// Text to Speech
export function speakText(
  text: string,
  lang: 'en-US' | 'ml-IN' = 'en-US',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop prior speeches

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // slightly slower for language learners
    utterance.pitch = 1.0;

    // Try finding preferred voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (lang === 'en-US') {
        const enVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      } else if (lang === 'ml-IN') {
        const mlVoice = voices.find((v) => v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam'));
        if (mlVoice) utterance.voice = mlVoice;
      }
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('Speech synthesis error:', e);
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
