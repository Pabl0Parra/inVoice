import { useCallback } from 'react';
import type { VoiceCommand, InvoiceAction } from '../types';
import { parseVoiceCommand } from '../utils/voiceParser';

/**
 * Return type for useVoiceCommands hook
 */
interface UseVoiceCommandsReturn {
  /** Process a transcript and execute the corresponding command */
  processTranscript: (transcript: string) => VoiceCommand | null;
  /** Convert a voice command to an invoice action */
  commandToAction: (command: VoiceCommand) => InvoiceAction | null;
}

/**
 * Custom hook for processing voice commands and converting them to invoice actions
 * Integrates voice recognition with invoice state management
 *
 * TODO: Enhance command processing in Phase 3
 *
 * @returns Voice command processing functions
 */
export const useVoiceCommands = (): UseVoiceCommandsReturn => {
  /**
   * Process a transcript and parse it into a voice command
   */
  const processTranscript = useCallback((transcript: string): VoiceCommand | null => {
    if (!transcript.trim()) {
      return null;
    }

    // Use the voice parser utility to extract command and data
    return parseVoiceCommand(transcript);
  }, []);

  /**
   * Convert a voice command to an invoice action
   */
  const commandToAction = useCallback((command: VoiceCommand): InvoiceAction | null => {
    switch (command.type) {
      case 'add_item':
        return {
          type: 'ADD_ITEM',
          payload: {
            description: String(command.payload.description || ''),
            quantity: Number(command.payload.quantity || 1),
            unitPrice: Number(command.payload.unitPrice || 0),
          },
        };

      case 'update_customer':
        return {
          type: 'SET_CUSTOMER',
          payload: {
            customerName: String(command.payload.customerName || ''),
            customerAddress: String(command.payload.customerAddress || ''),
          },
        };

      case 'set_tax':
        return {
          type: 'SET_TAX_RATE',
          payload: Number(command.payload.taxRate || 0),
        };

      case 'remove_item':
        return {
          type: 'REMOVE_ITEM',
          payload: String(command.payload.itemId || ''),
        };

      case 'set_date':
        if (command.payload.date) {
          return {
            type: 'SET_DATE',
            payload: new Date(String(command.payload.date)),
          };
        }
        return null;

      case 'set_due_date':
        if (command.payload.dueDate) {
          return {
            type: 'SET_DUE_DATE',
            payload: new Date(String(command.payload.dueDate)),
          };
        }
        return null;

      case 'set_invoice_number':
        return {
          type: 'SET_INVOICE_NUMBER',
          payload: String(command.payload.invoiceNumber || ''),
        };

      case 'set_notes':
        return {
          type: 'SET_NOTES',
          payload: String(command.payload.notes || ''),
        };

      // Navigation commands don't map to invoice actions
      case 'show_preview':
      case 'generate_pdf':
      case 'unknown':
        return null;

      default:
        return null;
    }
  }, []);

  return {
    processTranscript,
    commandToAction,
  };
};
