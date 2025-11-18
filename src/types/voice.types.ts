/**
 * Voice recognition and command processing type definitions
 */

/**
 * Voice command types that can be recognized
 */
export type VoiceCommandType =
  | 'add_item'
  | 'update_customer'
  | 'set_tax'
  | 'remove_item'
  | 'update_item'
  | 'set_date'
  | 'set_due_date'
  | 'set_invoice_number'
  | 'set_notes'
  | 'show_preview'
  | 'generate_pdf'
  | 'unknown';

/**
 * Parsed voice command with type and extracted data
 */
export interface VoiceCommand {
  /** Type of command recognized */
  type: VoiceCommandType;
  /** Extracted data from the command */
  payload: Record<string, string | number>;
  /** Original transcript text */
  rawText: string;
  /** Confidence score of recognition (0-1) */
  confidence: number;
}

/**
 * Speech recognition status states
 */
export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'error'
  | 'unsupported';

/**
 * Speech recognition error types
 */
export type SpeechRecognitionErrorType =
  | 'not-allowed'
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-supported'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

/**
 * Speech recognition error with details
 */
export interface SpeechRecognitionError {
  /** Type of error that occurred */
  type: SpeechRecognitionErrorType;
  /** Human-readable error message */
  message: string;
}

/**
 * Transcript segment from speech recognition
 */
export interface TranscriptSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Transcribed text */
  text: string;
  /** Timestamp when segment was created */
  timestamp: Date;
  /** Whether this is a final result or interim */
  isFinal: boolean;
  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Web Speech API SpeechRecognitionErrorEvent interface
 */
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

/**
 * Web Speech API SpeechRecognitionEvent interface
 */
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

/**
 * Web Speech API SpeechRecognitionResultList interface
 */
export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/**
 * Web Speech API SpeechRecognitionResult interface
 */
export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

/**
 * Web Speech API SpeechRecognitionAlternative interface
 */
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/**
 * Web Speech API SpeechRecognition interface extension
 * TypeScript doesn't include this by default, so we define it
 */
export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

/**
 * Speech Recognition constructor type
 */
export interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
  prototype: ISpeechRecognition;
}

/**
 * Supported language for voice recognition
 */
export interface SupportedLanguage {
  /** Language code (e.g., 'en-US', 'es-ES') */
  code: string;
  /** Display name */
  name: string;
}

/**
 * Voice recognition configuration
 */
export interface VoiceRecognitionConfig {
  /** Language code to use */
  language: string;
  /** Whether to use continuous recognition */
  continuous: boolean;
  /** Whether to return interim results */
  interimResults: boolean;
  /** Maximum number of alternatives to return */
  maxAlternatives: number;
}

/**
 * Default voice recognition configuration
 * Set to Spanish as primary, supports English too
 */
export const defaultVoiceConfig: VoiceRecognitionConfig = {
  language: 'es-ES', // Spanish as default, but patterns support both
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
};

/**
 * Supported languages for the application
 */
export const supportedLanguages: SupportedLanguage[] = [
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
];
