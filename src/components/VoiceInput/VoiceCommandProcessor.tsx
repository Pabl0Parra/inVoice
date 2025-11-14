import { type FC } from 'react';
import type { VoiceCommand } from '../../types';

/**
 * Props for VoiceCommandProcessor component
 */
interface VoiceCommandProcessorProps {
  /** Last processed command */
  lastCommand: VoiceCommand | null;
  /** Callback when a command is executed */
  onCommandExecuted?: (command: VoiceCommand) => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Displays the last processed voice command with visual feedback
 * Helps users understand what command was recognized
 */
export const VoiceCommandProcessor: FC<VoiceCommandProcessorProps> = ({
  lastCommand,
  className = '',
}) => {
  if (!lastCommand) {
    return null;
  }

  /**
   * Get a user-friendly description of the command
   */
  const getCommandDescription = (command: VoiceCommand): string => {
    switch (command.type) {
      case 'add_item':
        return `Added item: ${command.payload.description || 'Unknown'}`;
      case 'update_customer':
        return `Updated customer: ${command.payload.customerName || 'Unknown'}`;
      case 'set_tax':
        return `Set tax rate to ${command.payload.taxRate}%`;
      case 'remove_item':
        return `Removed item ${command.payload.itemId || 'Unknown'}`;
      case 'update_item':
        return `Updated item ${command.payload.itemId || 'Unknown'}`;
      case 'set_date':
        return 'Updated invoice date';
      case 'set_due_date':
        return 'Updated due date';
      case 'set_invoice_number':
        return `Set invoice number to ${command.payload.invoiceNumber}`;
      case 'set_notes':
        return 'Updated notes';
      case 'show_preview':
        return 'Showing preview';
      case 'generate_pdf':
        return 'Generating PDF...';
      case 'unknown':
        return 'Command not recognized';
      default:
        return 'Processing command...';
    }
  };

  const isUnknown = lastCommand.type === 'unknown';
  const confidencePercentage = (lastCommand.confidence * 100).toFixed(0);

  return (
    <div
      className={`rounded-lg p-3 ${
        isUnknown ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isUnknown ? 'text-yellow-800' : 'text-green-800'}`}>
            {getCommandDescription(lastCommand)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            "{lastCommand.rawText}"
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isUnknown ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}
          title="Recognition confidence"
        >
          {confidencePercentage}%
        </span>
      </div>
    </div>
  );
};
