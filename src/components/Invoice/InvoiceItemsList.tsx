import { type FC } from 'react';
import type { InvoiceItem as InvoiceItemType } from '../../types';
import { InvoiceItem } from './InvoiceItem';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Calculate summary totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className={`${className}`}>
      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
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
          <p className="mt-2 text-sm md:text-base">{t.noItemsYet}</p>
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
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t.subtotal}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {items.length}{' '}
              {items.length === 1
                ? t.invoiceItems.toLowerCase()
                : t.invoiceItems.toLowerCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
