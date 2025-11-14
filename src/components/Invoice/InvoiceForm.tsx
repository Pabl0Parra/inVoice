import { type FC, type FormEvent, useState } from 'react';
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
 */
export const InvoiceForm: FC<InvoiceFormProps> = ({
  invoiceData,
  onUpdate,
  className = '',
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  /**
   * Handle field value changes
   */
  const handleFieldChange = (field: keyof InvoiceData, value: string | number | Date): void => {
    onUpdate({ [field]: value });
  };

  /**
   * Handle form submission (prevent default)
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  /**
   * Format date for input field
   */
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      aria-label="Invoice details form"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>

      <div className="space-y-4">
        {/* Invoice Number */}
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
            onFocus={() => setFocusedField('invoiceNumber')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              focusedField === 'invoiceNumber' ? 'border-blue-500' : 'border-gray-300'
            }`}
            placeholder="INV-001"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              id="invoiceDate"
              value={formatDateForInput(invoiceData.date)}
              onChange={(e) => handleFieldChange('date', new Date(e.target.value))}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                focusedField === 'date' ? 'border-blue-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formatDateForInput(invoiceData.dueDate)}
              onChange={(e) => handleFieldChange('dueDate', new Date(e.target.value))}
              onFocus={() => setFocusedField('dueDate')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                focusedField === 'dueDate' ? 'border-blue-500' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={invoiceData.customerName}
            onChange={(e) => handleFieldChange('customerName', e.target.value)}
            onFocus={() => setFocusedField('customerName')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              focusedField === 'customerName' ? 'border-blue-500' : 'border-gray-300'
            }`}
            placeholder="John Smith"
          />
        </div>

        {/* Customer Address */}
        <div>
          <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Address
          </label>
          <textarea
            id="customerAddress"
            value={invoiceData.customerAddress}
            onChange={(e) => handleFieldChange('customerAddress', e.target.value)}
            onFocus={() => setFocusedField('customerAddress')}
            onBlur={() => setFocusedField(null)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              focusedField === 'customerAddress' ? 'border-blue-500' : 'border-gray-300'
            }`}
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        {/* Tax Rate */}
        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <input
            type="number"
            id="taxRate"
            value={invoiceData.taxRate * 100}
            onChange={(e) => handleFieldChange('taxRate', Number(e.target.value) / 100)}
            onFocus={() => setFocusedField('taxRate')}
            onBlur={() => setFocusedField(null)}
            min="0"
            max="100"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              focusedField === 'taxRate' ? 'border-blue-500' : 'border-gray-300'
            }`}
            placeholder="10"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={invoiceData.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              focusedField === 'notes' ? 'border-blue-500' : 'border-gray-300'
            }`}
            placeholder="Payment terms, thank you message, etc."
          />
        </div>
      </div>

      {/* Totals Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium text-gray-900">${invoiceData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Tax ({(invoiceData.taxRate * 100).toFixed(1)}%):
          </span>
          <span className="font-medium text-gray-900">${invoiceData.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
          <span className="text-gray-900">Total:</span>
          <span className="text-blue-600">${invoiceData.total.toFixed(2)}</span>
        </div>
      </div>
    </form>
  );
};
