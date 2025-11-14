import { type FC } from 'react';
import type { InvoiceItem as InvoiceItemType } from '../../types';
import { InvoiceItem } from './InvoiceItem';

/**
 * Props for InvoiceItemsList component
 */
interface InvoiceItemsListProps {
  /** Array of invoice items to display */
  items: InvoiceItemType[];
  /** Currently editing item ID */
  editingItemId?: string | null;
  /** Callback when an item is edited */
  onEditItem?: (item: InvoiceItemType) => void;
  /** Callback when an item is deleted */
  onDeleteItem?: (itemId: string) => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Scrollable list of invoice items with touch-optimized interactions
 * Displays all line items with totals and action buttons
 */
export const InvoiceItemsList: FC<InvoiceItemsListProps> = ({
  items,
  editingItemId = null,
  onEditItem,
  onDeleteItem,
  className = '',
}) => {
  // Calculate summary totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className={`${className}`}>
      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm">No items yet</p>
          <p className="text-xs mt-1">Add items using voice commands or the form below</p>
        </div>
      ) : (
        <div role="list" className="space-y-3">
          {items.map((item, index) => (
            <InvoiceItem
              key={item.id}
              item={item}
              index={index}
              isEditing={item.id === editingItemId}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}

          {/* Subtotal summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
