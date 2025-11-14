import { type FC, useEffect, useRef } from 'react';
import type { TranscriptSegment } from '../../types';

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
    if (confidence >= 0.8) return 'text-green-700';
    if (confidence >= 0.6) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div
      ref={scrollRef}
      className={`bg-white rounded-lg shadow-md p-4 max-h-64 overflow-y-auto ${className}`}
      role="log"
      aria-live="polite"
      aria-label="Voice transcription"
    >
      {segments.length === 0 && !interimTranscript ? (
        <p className="text-gray-400 text-center italic">
          Press the microphone button to start speaking...
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
              <p className="flex-1 text-gray-800">{segment.text}</p>
              <span className="text-xs text-gray-400">
                {segment.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {interimTranscript && (
            <div className="flex items-start gap-2">
              <span className="text-sm text-gray-400">...</span>
              <p className="flex-1 text-gray-500 italic">{interimTranscript}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
