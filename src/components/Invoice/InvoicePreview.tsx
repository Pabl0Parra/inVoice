import { type FC } from 'react';
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
 */
export const InvoicePreview: FC<InvoicePreviewProps> = ({
  invoiceData,
  className = '',
}) => {
  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 ${className}`}
      aria-label="Invoice preview"
    >
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 md:pb-6 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          INVOICE
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-2">
          {invoiceData.invoiceNumber || 'No invoice number'}
        </p>
      </div>

      {/* Invoice Info and Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Invoice Details */}
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
            Invoice Details
          </h2>
          <div className="text-xs md:text-sm space-y-1">
            <p>
              <span className="text-gray-600">Date:</span>{' '}
              <span className="text-gray-900">
                {formatDate(invoiceData.date)}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Due Date:</span>{' '}
              <span className="text-gray-900">
                {formatDate(invoiceData.dueDate)}
              </span>
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
            Bill To
          </h2>
          <div className="text-xs md:text-sm">
            <p className="font-medium text-gray-900">
              {invoiceData.customerName || 'Customer name'}
            </p>
            <p className="text-gray-600 mt-1 whitespace-pre-line">
              {invoiceData.customerAddress || 'Customer address'}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="text-center py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 w-16 md:w-20">
                Qty
              </th>
              <th className="text-right py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 w-20 md:w-24">
                Unit Price
              </th>
              <th className="text-right py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-semibold text-gray-700 w-20 md:w-24">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-400 text-xs md:text-sm"
                >
                  No items added yet
                </td>
              </tr>
            ) : (
              invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 text-right">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900 text-right font-medium">
                    ${item.total.toFixed(2)}
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
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900 font-medium">
              ${invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-600">
              Tax ({(invoiceData.taxRate * 100).toFixed(1)}%):
            </span>
            <span className="text-gray-900 font-medium">
              ${invoiceData.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t-2 border-gray-300">
            <span className="text-gray-900">Total:</span>
            <span className="text-blue-600">
              ${invoiceData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
          <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
            Notes
          </h3>
          <p className="text-xs md:text-sm text-gray-600 whitespace-pre-line">
            {invoiceData.notes}
          </p>
        </div>
      )}
    </div>
  );
};
