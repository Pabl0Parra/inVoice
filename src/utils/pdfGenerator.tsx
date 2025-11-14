import { pdf } from '@react-pdf/renderer';
import { InvoicePDFTemplate } from '../components/PDF';
import type { InvoiceData } from '../types';

/**
 * PDF generation utilities
 * Functions for creating and downloading invoice PDFs using @react-pdf/renderer
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
 * Generate invoice PDF using @react-pdf/renderer
 *
 * @param invoiceData - Invoice data to generate PDF from
 * @returns Promise that resolves to PDF blob
 */
export const generateInvoicePDF = async (
  invoiceData: InvoiceData
): Promise<Blob> => {
  try {
    // Create PDF document from template
    const pdfDocument = <InvoicePDFTemplate invoiceData={invoiceData} />;

    // Generate blob
    const blob = await pdf(pdfDocument).toBlob();

    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
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
