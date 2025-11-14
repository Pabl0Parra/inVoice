/**
 * Central export file for all type definitions
 * Import types from here to maintain consistency across the application
 */

// Invoice types
export type {
  InvoiceItem,
  InvoiceData,
  InvoiceAction,
} from './invoice.types';

export { initialInvoiceState } from './invoice.types';

// Voice recognition types
export type {
  VoiceCommandType,
  VoiceCommand,
  SpeechRecognitionStatus,
  SpeechRecognitionErrorType,
  SpeechRecognitionError,
  TranscriptSegment,
  ISpeechRecognition,
  ISpeechRecognitionConstructor,
  SupportedLanguage,
  VoiceRecognitionConfig,
} from './voice.types';

export {
  defaultVoiceConfig,
  supportedLanguages,
} from './voice.types';
