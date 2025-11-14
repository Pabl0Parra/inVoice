import type { FC } from 'react';
import type { InvoiceData } from '../../types';

/**
 * Props for InvoiceTemplate component
 */
interface InvoiceTemplateProps {
  /** Invoice data to render in template */
  invoiceData: InvoiceData;
}

/**
 * Professional invoice template for PDF generation
 * This component will be used by the PDF generator to create the final document
 * TODO: Integrate with @react-pdf/renderer or jspdf in Phase 5
 */
export const InvoiceTemplate: FC<InvoiceTemplateProps> = ({ invoiceData }) => {
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
    <div className="bg-white p-12 max-w-4xl mx-auto">
      {/* Company Branding Area */}
      <div className="mb-8">
        <div className="text-4xl font-bold text-gray-800">Your Company Name</div>
        <div className="text-sm text-gray-600 mt-2">
          123 Business Street<br />
          City, State 12345<br />
          Phone: (555) 123-4567<br />
          Email: info@company.com
        </div>
      </div>

      {/* Invoice Header */}
      <div className="border-b-4 border-blue-600 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">INVOICE</h1>
        <div className="mt-4 grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600">Invoice Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoiceData.invoiceNumber || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(invoiceData.date)}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Bill To</h2>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-lg font-semibold text-gray-900">
            {invoiceData.customerName || 'Customer Name'}
          </p>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
            {invoiceData.customerAddress || 'Customer Address'}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Due Date</p>
          <p className="text-base font-medium text-gray-900">
            {formatDate(invoiceData.dueDate)}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-center py-3 px-4 font-semibold w-24">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold w-32">Unit Price</th>
              <th className="text-right py-3 px-4 font-semibold w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-3 px-4 text-gray-900">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-medium text-gray-900">
              ${invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-700">
              Tax ({(invoiceData.taxRate * 100).toFixed(1)}%)
            </span>
            <span className="font-medium text-gray-900">
              ${invoiceData.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-blue-600 text-white px-4 mt-2 rounded">
            <span className="text-xl font-bold">Total Due</span>
            <span className="text-2xl font-bold">
              ${invoiceData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {invoiceData.notes && (
        <div className="mb-8 border-t border-gray-300 pt-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Notes</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-6 text-center">
        <p className="text-xs text-gray-600">
          Thank you for your business!
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Please make payment by the due date. For questions, contact us at info@company.com
        </p>
      </div>
    </div>
  );
};
