import type { VoiceCommand, VoiceCommandType } from '../types';

/**
 * Pattern matching for voice commands
 * Supports both English and Spanish with flexible patterns
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
  /** Description for debugging */
  description?: string;
}

/**
 * Command patterns for parsing voice input
 * Supports English and Spanish
 * Order matters - more specific patterns should come first
 */
const commandPatterns: CommandPattern[] = [
  // Add item - English: "Add 5 laptops at 20" / "Add laptop at 20 dollars"
  // Add item - Spanish: "Añadir 5 laptops a 20" / "Agregar laptop a 20 dólares"
  {
    pattern: /(?:add|añadir|agregar|a[ñn]ade)\s+(?:(\d+)\s+)?(?:units?\s+of\s+|unidades?\s+de\s+)?(.+?)\s+(?:at|a)\s+\$?(\d+(?:[.,]\d{1,2})?)/i,
    type: 'add_item',
    extractPayload: (matches) => ({
      quantity: matches[1] ? parseInt(matches[1], 10) : 1,
      description: matches[2].trim(),
      unitPrice: parseFloat(matches[3].replace(',', '.')),
    }),
    description: 'Add item with quantity and price',
  },

  // Add item - simpler pattern: "Add laptop 20" / "Añadir laptop 20"
  {
    pattern: /(?:add|añadir|agregar|a[ñn]ade)\s+(.+?)\s+(\d+(?:[.,]\d{1,2})?)/i,
    type: 'add_item',
    extractPayload: (matches) => ({
      quantity: 1,
      description: matches[1].trim(),
      unitPrice: parseFloat(matches[2].replace(',', '.')),
    }),
    description: 'Add item simplified',
  },

  // Customer name - English: "Customer is John" / "Customer name is John"
  // Customer name - Spanish: "Cliente es John" / "Nombre del cliente es John"
  {
    pattern: /(?:customer|cliente)(?:\s+name|\s+nombre)?\s+(?:is|es)\s+(.+)/i,
    type: 'update_customer',
    extractPayload: (matches) => ({
      customerName: matches[1].trim(),
      customerAddress: '',
    }),
    description: 'Set customer name',
  },

  // Customer address - English: "Address is 123 Main"
  // Customer address - Spanish: "Dirección es 123 Main"
  {
    pattern: /(?:customer\s+)?(?:address|direcci[oó]n)\s+(?:is|es)\s+(.+)/i,
    type: 'update_customer',
    extractPayload: (matches) => ({
      customerName: '',
      customerAddress: matches[1].trim(),
    }),
    description: 'Set customer address',
  },

  // Tax rate - English: "Set tax to 10" / "Tax 10 percent"
  // Tax rate - Spanish: "Impuesto 10" / "IVA 10 por ciento"
  {
    pattern: /(?:set\s+)?(?:tax|impuesto|iva)(?:\s+rate|\s+tasa)?\s+(?:to|a)?\s*(\d+(?:[.,]\d+)?)\s*(?:%|percent|por\s*ciento)?/i,
    type: 'set_tax',
    extractPayload: (matches) => ({
      taxRate: parseFloat(matches[1].replace(',', '.')) / 100,
    }),
    description: 'Set tax rate',
  },

  // Remove item - English: "Delete item 2" / "Remove last item"
  // Remove item - Spanish: "Eliminar artículo 2" / "Borrar último"
  {
    pattern: /(?:delete|remove|eliminar|borrar)\s+(?:item|art[ií]culo|elemento)?\s*(\d+|last|[uú]ltimo)/i,
    type: 'remove_item',
    extractPayload: (matches) => ({
      itemId: matches[1].toLowerCase().replace('último', 'last').replace('ultimo', 'last'),
    }),
    description: 'Remove item',
  },

  // Invoice number - English: "Invoice number INV-001"
  // Invoice number - Spanish: "Número de factura INV-001"
  {
    pattern: /(?:invoice|factura)\s+(?:number|n[uú]mero)\s+(?:is\s+|es\s+)?(.+)/i,
    type: 'set_invoice_number',
    extractPayload: (matches) => ({
      invoiceNumber: matches[1].trim(),
    }),
    description: 'Set invoice number',
  },

  // Notes - English: "Add note Payment terms" / "Set notes to Payment terms"
  // Notes - Spanish: "Añadir nota Términos" / "Notas Términos"
  {
    pattern: /(?:add|set|añadir|agregar)\s+(?:note|nota)(?:s|tas)?\s+(?:to\s+)?(.+)/i,
    type: 'set_notes',
    extractPayload: (matches) => ({
      notes: matches[1].trim(),
    }),
    description: 'Set notes',
  },

  // Show preview - English: "Show preview" / Spanish: "Mostrar vista previa"
  {
    pattern: /(?:show|mostrar)\s+(?:preview|vista\s+previa|previsualizaci[oó]n)/i,
    type: 'show_preview',
    extractPayload: () => ({}),
    description: 'Show preview',
  },

  // Generate PDF - English: "Generate PDF" / Spanish: "Generar PDF"
  {
    pattern: /(?:generate|generar|crear)\s+pdf/i,
    type: 'generate_pdf',
    extractPayload: () => ({}),
    description: 'Generate PDF',
  },
];

/**
 * Parse a voice transcript into a structured command
 * Includes debug logging to help troubleshoot recognition issues
 *
 * @param transcript - The voice transcript to parse
 * @returns Parsed voice command
 */
export const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const normalizedText = transcript.trim().toLowerCase();

  console.log('🎤 Parsing voice command:', transcript);
  console.log('📝 Normalized text:', normalizedText);

  // Try to match against known patterns
  for (const { pattern, type, extractPayload, description } of commandPatterns) {
    const matches = normalizedText.match(pattern);

    if (matches) {
      console.log('✅ Match found:', description || type);
      console.log('   Pattern:', pattern);
      console.log('   Matches:', matches);

      const payload = extractPayload(matches);
      console.log('   Payload:', payload);

      return {
        type,
        payload,
        rawText: transcript,
        confidence: 0.9,
      };
    }
  }

  // No pattern matched - return unknown command
  console.warn('❌ No pattern matched for:', transcript);
  console.log('💡 Available commands:');
  commandPatterns.forEach(({ description, type }) => {
    if (description) console.log(`   - ${description} (${type})`);
  });

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
