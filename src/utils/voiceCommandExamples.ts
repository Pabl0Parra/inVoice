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
 * Examples tailored for commercial painting company
 */
export const voiceCommandExamples: VoiceCommandExample[] = [
  {
    type: 'update_customer',
    fieldName: 'customerName',
    examplesEn: [
      'Customer is Central Tower Building',
      'Customer name is Plaza Commercial Corp',
    ],
    examplesEs: [
      'Cliente es Edificio Torre Central',
      'Nombre del cliente es Plaza Comercial S.A.',
    ],
  },
  {
    type: 'update_customer',
    fieldName: 'customerAddress',
    examplesEn: [
      'Address is 123 Business Plaza Suite 400',
      'Customer address is 789 Commerce Boulevard',
    ],
    examplesEs: [
      'Dirección es Av. Principal 123 Oficina 400',
      'Dirección del cliente es Blvd. Comercio 789',
    ],
  },
  {
    type: 'add_item',
    fieldName: 'items',
    examplesEn: [
      'Add 500 square feet exterior painting at 3.50',
      'Add 10 gallons premium paint at 45',
      'Add 8 hours labor at 65',
    ],
    examplesEs: [
      'Añadir 500 pies cuadrados pintura exterior a 3.50',
      'Agregar 10 galones pintura premium a 45',
      'Añadir 8 horas mano de obra a 65',
    ],
  },
  {
    type: 'set_tax',
    fieldName: 'tax',
    examplesEn: ['Tax 10 percent', 'Set tax to 8', 'IVA 16'],
    examplesEs: ['Impuesto 10 por ciento', 'IVA 16', 'Tasa de impuesto 8'],
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
    examplesEn: [
      'Add note Commercial painting work completed',
      'Set notes to Payment due within 30 days',
    ],
    examplesEs: [
      'Añadir nota Trabajo de pintura comercial completado',
      'Notas Pago dentro de 30 días',
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
