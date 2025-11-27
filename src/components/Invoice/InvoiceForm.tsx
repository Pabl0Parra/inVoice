import { type FC, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { InvoiceData } from '../../types';

/**
 * Props for InvoiceForm component
 */
interface InvoiceFormProps {
  /** Current invoice data */
  invoiceData: InvoiceData;
  /** Callback when invoice data is updated */
  onUpdate: (data: Partial<InvoiceData>) => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Dynamic invoice form with touch-optimized inputs
 * Updates from voice commands and allows manual editing
 * Supports bilingual display for commercial painting companies
 */
export const InvoiceForm: FC<InvoiceFormProps> = ({
  invoiceData,
  onUpdate,
  className = '',
}) => {
  const { t } = useLanguage();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  /**
   * Handle field value changes
   */
  const handleFieldChange = (
    field: keyof InvoiceData,
    value: string | number | Date,
  ): void => {
    onUpdate({ [field]: value });
  };

  /**
   * Format date for input field
   */
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 ${className}`}
      aria-label="Invoice details form"
    >
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t.invoiceDetails}
      </h2>

      <div className="space-y-4">
        {/* Invoice Number - Auto-generated, read-only */}
        <div>
          <label
            htmlFor="invoiceNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t.invoiceNumber}
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
            onFocus={() => setFocusedField('invoiceNumber')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
              focusedField === 'invoiceNumber'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t.placeholderInvoiceNumber}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="invoiceDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.invoiceDate}
            </label>
            <input
              type="date"
              id="invoiceDate"
              value={formatDateForInput(invoiceData.date)}
              onChange={(e) =>
                handleFieldChange('date', new Date(e.target.value))
              }
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
                focusedField === 'date'
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.dueDate}
            </label>
            <input
              type="date"
              id="dueDate"
              value={formatDateForInput(invoiceData.dueDate)}
              onChange={(e) =>
                handleFieldChange('dueDate', new Date(e.target.value))
              }
              onFocus={() => setFocusedField('dueDate')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
                focusedField === 'dueDate'
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t.customerName}
          </label>
          <input
            type="text"
            id="customerName"
            value={invoiceData.customerName}
            onChange={(e) => handleFieldChange('customerName', e.target.value)}
            onFocus={() => setFocusedField('customerName')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
              focusedField === 'customerName'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t.placeholderCustomerName}
          />
        </div>

        {/* Customer Address */}
        <div>
          <label
            htmlFor="customerAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t.customerAddress}
          </label>
          <textarea
            id="customerAddress"
            value={invoiceData.customerAddress}
            onChange={(e) =>
              handleFieldChange('customerAddress', e.target.value)
            }
            onFocus={() => setFocusedField('customerAddress')}
            onBlur={() => setFocusedField(null)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
              focusedField === 'customerAddress'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t.placeholderCustomerAddress}
          />
        </div>

        {/* Tax Rate */}
        <div>
          <label
            htmlFor="taxRate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t.taxRate}
          </label>
          <input
            type="number"
            id="taxRate"
            value={invoiceData.taxRate * 100}
            onChange={(e) =>
              handleFieldChange('taxRate', Number(e.target.value) / 100)
            }
            onFocus={() => setFocusedField('taxRate')}
            onBlur={() => setFocusedField(null)}
            min="0"
            max="100"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
              focusedField === 'taxRate'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t.placeholderTaxRate}
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t.notes}
          </label>
          <textarea
            id="notes"
            value={invoiceData.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base dark:bg-gray-700 dark:text-gray-300 ${
              focusedField === 'notes'
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={t.placeholderNotes}
          />
        </div>
      </div>

      {/* Totals Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600 dark:text-gray-400">{t.subtotal}:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${invoiceData.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600 dark:text-gray-400">
            {t.tax} ({(invoiceData.taxRate * 100).toFixed(1)}%):
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            ${invoiceData.tax.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-base md:text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">{t.total}:</span>
          <span className="text-blue-600 dark:text-blue-400">
            ${invoiceData.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
