import { type FC } from 'react';
import type { SpeechRecognitionStatus } from '../../types';

/**
 * Props for MicrophoneButton component
 */
interface MicrophoneButtonProps {
  /** Current status of speech recognition */
  status: SpeechRecognitionStatus;
  /** Callback when button is clicked to toggle recording */
  onToggle: () => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Large, accessible microphone button with visual feedback for recording states
 * Optimized for touch interaction on mobile devices
 */
export const MicrophoneButton: FC<MicrophoneButtonProps> = ({
  status,
  onToggle,
  className = '',
}) => {
  // Button styling based on status
  const getButtonStyles = (): string => {
    const baseStyles = 'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg';

    switch (status) {
      case 'listening':
        return `${baseStyles} bg-red-500 hover:bg-red-600 animate-pulse`;
      case 'processing':
        return `${baseStyles} bg-yellow-500 opacity-75 cursor-wait`;
      case 'error':
        return `${baseStyles} bg-gray-400 cursor-not-allowed`;
      case 'unsupported':
        return `${baseStyles} bg-gray-300 cursor-not-allowed`;
      default:
        return `${baseStyles} bg-blue-500 hover:bg-blue-600 active:scale-95`;
    }
  };

  const isDisabled = status === 'processing' || status === 'unsupported' || status === 'error';

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`${getButtonStyles()} ${className}`}
      aria-label={status === 'listening' ? 'Stop recording' : 'Start recording'}
      aria-pressed={status === 'listening'}
      type="button"
    >
      {/* Microphone icon - placeholder, replace with actual icon library */}
      <svg
        className="w-10 h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
};
