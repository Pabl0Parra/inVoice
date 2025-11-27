import { type FC } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/currency';
import type { InvoiceData } from '../../types';

/**
 * Props for InvoicePreview component
 */
interface InvoicePreviewProps {
  /** Invoice data to preview */
  invoiceData: InvoiceData;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Real-time preview of the invoice in PDF-like format
 * Responsive layout that adapts to screen size
 * Supports dark mode and bilingual display
 */
export const InvoicePreview: FC<InvoicePreviewProps> = ({
  invoiceData,
  className = '',
}) => {
  const { t, language } = useLanguage();

  /**
   * Format date for display based on current language
   */
  const formatDate = (date: Date): string => {
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 lg:p-8 ${className}`}
      aria-label="Invoice preview"
    >
      {/* Header */}
      <div className="border-b-2 border-gray-300 dark:border-gray-600 pb-4 md:pb-6 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {t.pdfInvoiceTitle}
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2">
          {invoiceData.invoiceNumber || (language === 'es' ? 'Sin número de factura' : 'No invoice number')}
        </p>
      </div>

      {/* Invoice Info and Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Invoice Details */}
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t.invoiceDetails}
          </h2>
          <div className="text-xs md:text-sm space-y-1">
            <p>
              <span className="text-gray-600 dark:text-gray-400">{t.invoiceDate}:</span>{' '}
              <span className="text-gray-900 dark:text-white">
                {formatDate(invoiceData.date)}
              </span>
            </p>
            <p>
              <span className="text-gray-600 dark:text-gray-400">{t.dueDate}:</span>{' '}
              <span className="text-gray-900 dark:text-white">
                {formatDate(invoiceData.dueDate)}
              </span>
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t.pdfBillTo}
          </h2>
          <div className="text-xs md:text-sm">
            <p className="font-medium text-gray-900 dark:text-white">
              {invoiceData.customerName || (language === 'es' ? 'Nombre del cliente' : 'Customer name')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">
              {invoiceData.customerAddress || (language === 'es' ? 'Dirección del cliente' : 'Customer address')}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-left py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t.description}
              </th>
              <th className="text-center py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 w-16 md:w-20">
                {t.pdfQty}
              </th>
              <th className="text-right py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 w-20 md:w-24">
                {t.unitPrice}
              </th>
              <th className="text-right py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 w-20 md:w-24">
                {t.total}
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs md:text-sm"
                >
                  {t.noItemsYet}
                </td>
              </tr>
            ) : (
              invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 dark:text-white">
                    {item.description}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 dark:text-white text-center">
                    {item.quantity}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(item.unitPrice, language)}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 dark:text-white text-right font-medium">
                    {formatCurrency(item.total, language)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t.subtotal}:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatCurrency(invoiceData.subtotal, language)}
            </span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t.tax} ({(invoiceData.taxRate * 100).toFixed(1)}%):
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatCurrency(invoiceData.tax, language)}
            </span>
          </div>
          <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t-2 border-gray-300 dark:border-gray-600">
            <span className="text-gray-900 dark:text-white">{t.total}:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {formatCurrency(invoiceData.total, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t.notes}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {invoiceData.notes}
          </p>
        </div>
      )}
    </div>
  );
};
