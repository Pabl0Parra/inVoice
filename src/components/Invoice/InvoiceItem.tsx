import { type FC } from 'react';
import type { InvoiceItem as InvoiceItemType } from '../../types';

/**
 * Props for InvoiceItem component
 */
interface InvoiceItemProps {
  /** The invoice item data */
  item: InvoiceItemType;
  /** Item index in the list */
  index: number;
  /** Callback when item is edited */
  onEdit?: (item: InvoiceItemType) => void;
  /** Callback when item is deleted */
  onDelete?: (itemId: string) => void;
  /** Whether the item is in edit mode */
  isEditing?: boolean;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Individual invoice line item display with touch-optimized controls
 * Supports tap to edit and swipe-to-delete gestures
 */
export const InvoiceItem: FC<InvoiceItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  isEditing = false,
  className = '',
}) => {
  const handleEdit = (): void => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = (): void => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border border-gray-200 ${
        isEditing ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      role="listitem"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Item number badge */}
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>

        {/* Item details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.description}
          </h4>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            <span>Qty: {item.quantity}</span>
            <span>@ ${item.unitPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Total price */}
        <div className="flex-shrink-0 text-right">
          <p className="text-sm font-semibold text-gray-900">
            ${item.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleEdit}
          className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 active:bg-blue-200 transition-colors"
          aria-label={`Edit item ${index + 1}`}
          type="button"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 active:bg-red-200 transition-colors"
          aria-label={`Delete item ${index + 1}`}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
