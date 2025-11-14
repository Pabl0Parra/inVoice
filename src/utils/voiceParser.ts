import type { VoiceCommand, VoiceCommandType } from '../types';

/**
 * Pattern matching for voice commands
 * Uses regex patterns to extract data from natural language input
 *
 * TODO: Enhance patterns and add more command types in Phase 3
 */

/**
 * Command pattern definition
 */
interface CommandPattern {
  /** Regex pattern to match */
  pattern: RegExp;
  /** Command type this pattern maps to */
  type: VoiceCommandType;
  /** Function to extract payload from matches */
  extractPayload: (matches: RegExpMatchArray) => Record<string, string | number>;
}

/**
 * Command patterns for parsing voice input
 * Order matters - more specific patterns should come first
 */
const commandPatterns: CommandPattern[] = [
  // Add item: "Add 5 units of Product X at $20 each" or "Add Product X at 20 dollars each quantity 5"
  {
    pattern: /add\s+(?:(\d+)\s+)?(?:units?\s+of\s+)?(.+?)\s+at\s+\$?(\d+(?:\.\d{2})?)/i,
    type: 'add_item',
    extractPayload: (matches) => ({
      quantity: matches[1] ? parseInt(matches[1], 10) : 1,
      description: matches[2].trim(),
      unitPrice: parseFloat(matches[3]),
    }),
  },

  // Customer name: "Customer is John Smith" or "Customer name is John Smith"
  {
    pattern: /customer(?:\s+name)?\s+is\s+(.+)/i,
    type: 'update_customer',
    extractPayload: (matches) => ({
      customerName: matches[1].trim(),
      customerAddress: '',
    }),
  },

  // Customer address: "Address is 123 Main Street"
  {
    pattern: /(?:customer\s+)?address\s+is\s+(.+)/i,
    type: 'update_customer',
    extractPayload: (matches) => ({
      customerName: '',
      customerAddress: matches[1].trim(),
    }),
  },

  // Tax rate: "Set tax to 10 percent" or "Tax rate 10%"
  {
    pattern: /(?:set\s+)?tax(?:\s+rate)?\s+(?:to\s+)?(\d+(?:\.\d+)?)\s*%?/i,
    type: 'set_tax',
    extractPayload: (matches) => ({
      taxRate: parseFloat(matches[1]) / 100,
    }),
  },

  // Remove item: "Delete item 2" or "Remove last item"
  {
    pattern: /(?:delete|remove)\s+(?:item\s+)?(\d+|last)/i,
    type: 'remove_item',
    extractPayload: (matches) => ({
      itemId: matches[1].toLowerCase(),
    }),
  },

  // Invoice number: "Invoice number is INV-001"
  {
    pattern: /invoice\s+number\s+(?:is\s+)?(.+)/i,
    type: 'set_invoice_number',
    extractPayload: (matches) => ({
      invoiceNumber: matches[1].trim(),
    }),
  },

  // Notes: "Add note" or "Set notes to"
  {
    pattern: /(?:add|set)\s+note(?:s)?\s+(?:to\s+)?(.+)/i,
    type: 'set_notes',
    extractPayload: (matches) => ({
      notes: matches[1].trim(),
    }),
  },

  // Show preview
  {
    pattern: /show\s+preview/i,
    type: 'show_preview',
    extractPayload: () => ({}),
  },

  // Generate PDF
  {
    pattern: /generate\s+pdf/i,
    type: 'generate_pdf',
    extractPayload: () => ({}),
  },
];

/**
 * Parse a voice transcript into a structured command
 *
 * @param transcript - The voice transcript to parse
 * @returns Parsed voice command or null if no match
 */
export const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const normalizedText = transcript.trim().toLowerCase();

  // Try to match against known patterns
  for (const { pattern, type, extractPayload } of commandPatterns) {
    const matches = normalizedText.match(pattern);

    if (matches) {
      return {
        type,
        payload: extractPayload(matches),
        rawText: transcript,
        confidence: 0.9, // High confidence for pattern matches
      };
    }
  }

  // No pattern matched - return unknown command
  return {
    type: 'unknown',
    payload: {},
    rawText: transcript,
    confidence: 0,
  };
};

/**
 * Extract a number from text (handles spelled out numbers and digits)
 * TODO: Implement full number extraction in Phase 3
 *
 * @param text - Text to extract number from
 * @returns Extracted number or null
 */
export const extractNumber = (text: string): number | null => {
  // Simple digit extraction for now
  const match = text.match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

/**
 * Extract a price from text (handles $, dollars, etc.)
 *
 * @param text - Text to extract price from
 * @returns Extracted price or null
 */
export const extractPrice = (text: string): number | null => {
  const patterns = [
    /\$(\d+(?:\.\d{2})?)/,  // $20.00
    /(\d+(?:\.\d{2})?)\s*dollars?/i,  // 20 dollars
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  return null;
};
