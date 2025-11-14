import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SpeechRecognitionStatus,
  SpeechRecognitionError,
  TranscriptSegment,
  VoiceRecognitionConfig,
  ISpeechRecognition,
  ISpeechRecognitionConstructor,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from '../types';
import { defaultVoiceConfig } from '../types';

/**
 * Return type for useSpeechRecognition hook
 */
interface UseSpeechRecognitionReturn {
  /** Current recognition status */
  status: SpeechRecognitionStatus;
  /** Array of final transcript segments */
  transcripts: TranscriptSegment[];
  /** Current interim (non-final) transcript */
  interimTranscript: string;
  /** Error if recognition failed */
  error: SpeechRecognitionError | null;
  /** Whether speech recognition is supported */
  isSupported: boolean;
  /** Start listening */
  startListening: () => void;
  /** Stop listening */
  stopListening: () => void;
  /** Reset all transcripts */
  resetTranscripts: () => void;
}

/**
 * Custom hook for Web Speech API integration
 * Handles speech recognition with proper TypeScript types and error handling
 *
 * @param config - Voice recognition configuration
 * @returns Speech recognition state and controls
 */
export const useSpeechRecognition = (
  config?: Partial<VoiceRecognitionConfig>
): UseSpeechRecognitionReturn => {
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle');
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<SpeechRecognitionError | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const finalConfig = { ...defaultVoiceConfig, ...config };

  // Initialize speech recognition on mount
  useEffect(() => {
    const SpeechRecognition = (window as typeof window & {
      SpeechRecognition?: ISpeechRecognitionConstructor;
      webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }).SpeechRecognition || (window as typeof window & {
      webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatus('unsupported');
      return;
    }

    setIsSupported(true);

    // Initialize recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = finalConfig.continuous;
    recognition.interimResults = finalConfig.interimResults;
    recognition.lang = finalConfig.language;
    recognition.maxAlternatives = finalConfig.maxAlternatives;

    // Handle recognition start
    recognition.onstart = () => {
      setStatus('listening');
      setError(null);
    };

    // Handle recognition end
    recognition.onend = () => {
      setStatus('idle');
    };

    // Handle recognition errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorType: SpeechRecognitionError['type'];
      let errorMessage: string;

      switch (event.error) {
        case 'not-allowed':
          errorType = 'not-allowed';
          errorMessage = 'Microphone access denied. Please grant permission to use voice input.';
          break;
        case 'no-speech':
          errorType = 'no-speech';
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'aborted':
          errorType = 'aborted';
          errorMessage = 'Speech recognition aborted.';
          break;
        case 'audio-capture':
          errorType = 'audio-capture';
          errorMessage = 'No microphone found. Please connect a microphone.';
          break;
        case 'network':
          errorType = 'network';
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'service-not-allowed':
          errorType = 'service-not-allowed';
          errorMessage = 'Speech recognition service not allowed.';
          break;
        case 'bad-grammar':
          errorType = 'bad-grammar';
          errorMessage = 'Grammar error in speech recognition.';
          break;
        case 'language-not-supported':
          errorType = 'language-not-supported';
          errorMessage = 'Selected language is not supported.';
          break;
        default:
          errorType = 'network';
          errorMessage = event.message || 'An unknown error occurred.';
      }

      setError({ type: errorType, message: errorMessage });
      setStatus('error');
    };

    // Handle recognition results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal) {
          // Add final transcript to the list
          const segment: TranscriptSegment = {
            id: crypto.randomUUID(),
            text: transcript,
            timestamp: new Date(),
            isFinal: true,
            confidence: confidence || 0.9,
          };

          setTranscripts((prev) => [...prev, segment]);
          setInterimTranscript('');
        } else {
          // Update interim transcript
          interim += transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [finalConfig.continuous, finalConfig.interimResults, finalConfig.language, finalConfig.maxAlternatives]);

  /**
   * Start listening for speech input
   */
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError({
        type: 'not-supported',
        message: 'Speech recognition is not supported in this browser. Please use Chrome or Edge.',
      });
      return;
    }

    if (!recognitionRef.current) {
      setError({
        type: 'network',
        message: 'Speech recognition not initialized.',
      });
      return;
    }

    if (status === 'listening') {
      return; // Already listening
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Handle case where recognition is already started
      console.warn('Speech recognition start error:', err);
    }
  }, [isSupported, status]);

  /**
   * Stop listening for speech input
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && status === 'listening') {
      recognitionRef.current.stop();
    }
  }, [status]);

  /**
   * Reset all transcripts
   */
  const resetTranscripts = useCallback(() => {
    setTranscripts([]);
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    status,
    transcripts,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscripts,
  };
};
