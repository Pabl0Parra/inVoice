import type { VoiceCommandType } from '../types';

/**
 * Voice command examples for each field/action
 * Helps users learn how to use voice commands
 */

export interface VoiceCommandExample {
  /** Command type */
  type: VoiceCommandType;
  /** Example commands in English */
  examplesEn: string[];
  /** Example commands in Spanish */
  examplesEs: string[];
  /** Associated field name (if applicable) */
  fieldName?: string;
}

/**
 * Map of voice commands organized by field/action
 */
export const voiceCommandExamples: VoiceCommandExample[] = [
  {
    type: 'update_customer',
    fieldName: 'customerName',
    examplesEn: ['Customer is John Smith', 'Customer name is ABC Corp'],
    examplesEs: ['Cliente es Juan Pérez', 'Nombre del cliente es ABC Corp'],
  },
  {
    type: 'update_customer',
    fieldName: 'customerAddress',
    examplesEn: [
      'Address is 123 Main Street',
      'Customer address is 456 Oak Ave',
    ],
    examplesEs: [
      'Dirección es Calle Principal 123',
      'Dirección del cliente es Av. Roble 456',
    ],
  },
  {
    type: 'add_item',
    fieldName: 'items',
    examplesEn: [
      'Add 5 laptops at 999',
      'Add consulting at 150 dollars',
      'Add service 50',
    ],
    examplesEs: [
      'Añadir 5 laptops a 999',
      'Agregar consultoría a 150 dólares',
      'Añadir servicio 50',
    ],
  },
  {
    type: 'set_tax',
    fieldName: 'tax',
    examplesEn: ['Tax 10 percent', 'Set tax to 21', 'IVA 16'],
    examplesEs: ['Impuesto 10 por ciento', 'IVA 21', 'Tasa de impuesto 16'],
  },
  {
    type: 'remove_item',
    fieldName: 'items',
    examplesEn: ['Delete item 2', 'Remove last item'],
    examplesEs: ['Eliminar artículo 2', 'Borrar último'],
  },
  {
    type: 'set_notes',
    fieldName: 'notes',
    examplesEn: ['Add note Payment terms 30 days', 'Set notes to Thank you'],
    examplesEs: [
      'Añadir nota Términos de pago 30 días',
      'Notas Gracias por su compra',
    ],
  },
  {
    type: 'show_preview',
    examplesEn: ['Show preview'],
    examplesEs: ['Mostrar vista previa'],
  },
  {
    type: 'generate_pdf',
    examplesEn: ['Generate PDF'],
    examplesEs: ['Generar PDF'],
  },
];

/**
 * Get voice command examples for a specific field
 */
export const getCommandsForField = (
  fieldName: string,
  language: 'en' | 'es',
): string[] => {
  const commands = voiceCommandExamples.filter(
    (cmd) => cmd.fieldName === fieldName,
  );

  return commands.flatMap((cmd) =>
    language === 'es' ? cmd.examplesEs : cmd.examplesEn,
  );
};

/**
 * Get all voice command examples
 */
export const getAllCommands = (
  language: 'en' | 'es',
): VoiceCommandExample[] => {
  return voiceCommandExamples.map((cmd) => ({
    ...cmd,
    examplesEn: language === 'en' ? cmd.examplesEn : [],
    examplesEs: language === 'es' ? cmd.examplesEs : [],
  }));
};
