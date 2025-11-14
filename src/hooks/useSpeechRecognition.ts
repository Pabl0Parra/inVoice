import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SpeechRecognitionStatus,
  SpeechRecognitionError,
  TranscriptSegment,
  VoiceRecognitionConfig,
  ISpeechRecognition,
  ISpeechRecognitionConstructor,
} from '../types';

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
 * TODO: Implement full Web Speech API integration in Phase 2
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

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = (window as typeof window & {
      SpeechRecognition?: ISpeechRecognitionConstructor;
      webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }).SpeechRecognition || (window as typeof window & {
      webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    }).webkitSpeechRecognition;

    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      // TODO: Initialize SpeechRecognition in Phase 2
      // recognitionRef.current = new SpeechRecognition();
      // Configure recognition with config parameters
    } else {
      setStatus('unsupported');
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [config]);

  /**
   * Start listening for speech input
   */
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError({
        type: 'not-supported',
        message: 'Speech recognition is not supported in this browser',
      });
      return;
    }

    // TODO: Implement in Phase 2
    setStatus('listening');
    console.log('Start listening (placeholder)');
  }, [isSupported]);

  /**
   * Stop listening for speech input
   */
  const stopListening = useCallback(() => {
    // TODO: Implement in Phase 2
    setStatus('idle');
    console.log('Stop listening (placeholder)');
  }, []);

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
