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
  /** Title in English */
  titleEn: string;
  /** Title in Spanish */
  titleEs: string;
}

/**
 * Map of voice commands organized by field/action
 * Examples tailored for commercial painting company
 */
export const voiceCommandExamples: VoiceCommandExample[] = [
  {
    type: 'update_customer',
    fieldName: 'customerName',
    titleEn: 'Update Customer Name',
    titleEs: 'Actualizar Nombre Cliente',
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
    titleEn: 'Update Customer Address',
    titleEs: 'Actualizar Dirección Cliente',
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
    titleEn: 'Add Item',
    titleEs: 'Añadir Artículo',
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
    titleEn: 'Set Tax Rate',
    titleEs: 'Establecer Impuesto',
    examplesEn: ['Tax 10 percent', 'Set tax to 8', 'IVA 16'],
    examplesEs: ['Impuesto 10 por ciento', 'IVA 16', 'Tasa de impuesto 8'],
  },
  {
    type: 'remove_item',
    fieldName: 'items',
    titleEn: 'Remove Item',
    titleEs: 'Eliminar Artículo',
    examplesEn: ['Delete item 2', 'Remove last item'],
    examplesEs: ['Eliminar artículo 2', 'Borrar último'],
  },
  {
    type: 'set_notes',
    fieldName: 'notes',
    titleEn: 'Set Notes',
    titleEs: 'Establecer Notas',
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
    titleEn: 'Show Preview',
    titleEs: 'Mostrar Vista Previa',
    examplesEn: ['Show preview'],
    examplesEs: ['Mostrar vista previa'],
  },
  {
    type: 'generate_pdf',
    titleEn: 'Generate PDF',
    titleEs: 'Generar PDF',
    examplesEn: ['Generate PDF'],
    examplesEs: ['Generar PDF'],
  },
  {
    type: 'set_invoice_number',
    fieldName: 'invoiceNumber',
    titleEn: 'Set Invoice Number',
    titleEs: 'Establecer Número de Factura',
    examplesEn: ['Set invoice number to INV-2024-001', 'Invoice number 12345'],
    examplesEs: ['Número de factura INV-2024-001', 'Establecer factura 12345'],
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
