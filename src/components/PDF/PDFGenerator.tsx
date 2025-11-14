import { type FC, type ReactElement, useState } from 'react';
import type { InvoiceData } from '../../types';
import { generateAndDownloadPDF, validateInvoiceForPDF } from '../../utils/pdfGenerator';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Props for PDFGenerator component
 */
interface PDFGeneratorProps {
  /** Invoice data to generate PDF from */
  invoiceData: InvoiceData;
  /** Optional CSS classes */
  className?: string;
}

/**
 * PDF generation status
 */
type PDFStatus = 'idle' | 'generating' | 'success' | 'error';

/**
 * Component for generating and downloading invoice PDFs
 * Shows loading state during generation and success/error feedback
 */
export const PDFGenerator: FC<PDFGeneratorProps> = ({
  invoiceData,
  className = '',
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<PDFStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Generate PDF from invoice data and trigger download
   */
  const handleGeneratePDF = async (): Promise<void> => {
    setStatus('generating');
    setErrorMessage('');

    try {
      // Validate invoice data
      const validationErrors = validateInvoiceForPDF(invoiceData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generate and download PDF
      await generateAndDownloadPDF(invoiceData);

      setStatus('success');

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate PDF');
    }
  };

  /**
   * Get button content based on status
   */
  const getButtonContent = (): ReactElement => {
    switch (status) {
      case 'generating':
        return (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t.generating}
          </>
        );
      case 'success':
        return (
          <>
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            PDF {t.generatePDF}!
          </>
        );
      case 'error':
        return (
          <>
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {t.error}
          </>
        );
      default:
        return (
          <>
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t.generatePDF}
          </>
        );
    }
  };

  /**
   * Get button styles based on status
   */
  const getButtonStyles = (): string => {
    const baseStyles = 'flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    switch (status) {
      case 'generating':
        return `${baseStyles} bg-blue-400 text-white cursor-wait`;
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500`;
    }
  };

  const isDisabled = status === 'generating' || invoiceData.items.length === 0;

  return (
    <div className={`${className}`}>
      <button
        onClick={handleGeneratePDF}
        disabled={isDisabled}
        className={`w-full ${getButtonStyles()} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Generate PDF"
        type="button"
      >
        {getButtonContent()}
      </button>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      {/* Help text */}
      {status === 'idle' && invoiceData.items.length === 0 && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Add at least one item to generate a PDF
        </p>
      )}
    </div>
  );
};
