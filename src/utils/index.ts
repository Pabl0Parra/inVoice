/**
 * Utility functions
 */

export {
  parseVoiceCommand,
  extractNumber,
  extractPrice,
} from './voiceParser';

export {
  calculateItemTotal,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateInvoiceTotals,
  formatCurrency,
  formatPercentage,
  roundCurrency,
} from './invoiceCalculations';

export {
  generatePDFFilename,
  generateInvoicePDF,
  downloadBlob,
  generateAndDownloadPDF,
  validateInvoiceForPDF,
} from './pdfGenerator';
