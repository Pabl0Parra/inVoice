import type { InvoiceData } from '../types';

/**
 * PDF generation utilities
 * Functions for creating and downloading invoice PDFs
 *
 * TODO: Implement actual PDF generation in Phase 5 using:
 * - Option 1: @react-pdf/renderer (React-based, declarative)
 * - Option 2: jsPDF with html2canvas (HTML to PDF conversion)
 */

/**
 * Generate PDF filename from invoice data
 *
 * @param invoiceData - Invoice data
 * @returns Formatted filename
 */
export const generatePDFFilename = (invoiceData: InvoiceData): string => {
  const invoiceNumber = invoiceData.invoiceNumber || 'draft';
  const date = invoiceData.date.toISOString().split('T')[0];

  return `invoice-${invoiceNumber}-${date}.pdf`;
};

/**
 * Generate invoice PDF
 *
 * TODO: Implement in Phase 5
 *
 * @param invoiceData - Invoice data to generate PDF from
 * @returns Promise that resolves to PDF blob
 */
export const generateInvoicePDF = async (
  invoiceData: InvoiceData
): Promise<Blob> => {
  // Placeholder implementation
  console.log('Generating PDF for invoice:', invoiceData);

  // Simulate PDF generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return empty blob for now
  return new Blob(['PDF content placeholder'], { type: 'application/pdf' });
};

/**
 * Download a blob as a file
 *
 * @param blob - Blob to download
 * @param filename - Filename for the download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate and download invoice PDF
 *
 * @param invoiceData - Invoice data
 * @returns Promise that resolves when download is complete
 */
export const generateAndDownloadPDF = async (
  invoiceData: InvoiceData
): Promise<void> => {
  const filename = generatePDFFilename(invoiceData);
  const pdfBlob = await generateInvoicePDF(invoiceData);
  downloadBlob(pdfBlob, filename);
};

/**
 * Validate invoice data before PDF generation
 *
 * @param invoiceData - Invoice data to validate
 * @returns Array of validation errors (empty if valid)
 */
export const validateInvoiceForPDF = (invoiceData: InvoiceData): string[] => {
  const errors: string[] = [];

  if (!invoiceData.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!invoiceData.customerName) {
    errors.push('Customer name is required');
  }

  if (invoiceData.items.length === 0) {
    errors.push('At least one item is required');
  }

  if (invoiceData.items.some((item) => !item.description)) {
    errors.push('All items must have a description');
  }

  if (invoiceData.items.some((item) => item.quantity <= 0)) {
    errors.push('All items must have a positive quantity');
  }

  if (invoiceData.items.some((item) => item.unitPrice < 0)) {
    errors.push('All items must have a non-negative unit price');
  }

  return errors;
};
