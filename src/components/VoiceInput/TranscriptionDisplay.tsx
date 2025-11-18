import { type FC, useEffect, useRef } from 'react';
import type { TranscriptSegment } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for TranscriptionDisplay component
 */
interface TranscriptionDisplayProps {
  /** Array of transcript segments to display */
  segments: TranscriptSegment[];
  /** Current interim (non-final) transcript */
  interimTranscript?: string;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Displays real-time voice transcription with auto-scroll
 * Shows confidence indicators and allows corrections
 */
export const TranscriptionDisplay: FC<TranscriptionDisplayProps> = ({
  segments,
  interimTranscript = '',
  className = '',
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments, interimTranscript]);

  /**
   * Get color class based on confidence score
   */
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-700 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-700 dark:text-yellow-400';
    return 'text-red-700 dark:text-red-400';
  };

  return (
    <div
      ref={scrollRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-64 overflow-y-auto ${className}`}
      role="log"
      aria-live="polite"
      aria-label={t.transcription}
    >
      {segments.length === 0 && !interimTranscript ? (
        <p className="text-gray-400 dark:text-gray-500 text-center italic">
          {t.noTranscriptionYet}
        </p>
      ) : (
        <div className="space-y-2">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-start gap-2">
              <span
                className={`text-sm ${getConfidenceColor(segment.confidence)}`}
                title={`Confidence: ${(segment.confidence * 100).toFixed(0)}%`}
              >
                {segment.isFinal ? '✓' : '...'}
              </span>
              <p className="flex-1 text-gray-800 dark:text-gray-200">{segment.text}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {segment.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {interimTranscript && (
            <div className="flex items-start gap-2">
              <span className="text-sm text-gray-400 dark:text-gray-500">...</span>
              <p className="flex-1 text-gray-500 dark:text-gray-400 italic">{interimTranscript}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
