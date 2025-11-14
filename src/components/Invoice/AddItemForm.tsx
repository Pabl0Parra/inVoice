import { type FC, type FormEvent, useState } from 'react';
import type { InvoiceItem } from '../../types';

/**
 * Props for AddItemForm component
 */
interface AddItemFormProps {
  /** Callback when a new item is added */
  onAddItem: (item: Omit<InvoiceItem, 'id' | 'total'>) => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Form for manually adding invoice items
 * Provides touch-optimized inputs as fallback to voice commands
 */
export const AddItemForm: FC<AddItemFormProps> = ({
  onAddItem,
  className = '',
}) => {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitPrice, setUnitPrice] = useState<string>('');

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validate inputs
    if (!description.trim()) {
      return;
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(unitPrice);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return;
    }

    if (isNaN(priceNum) || priceNum < 0) {
      return;
    }

    // Add item
    onAddItem({
      description: description.trim(),
      quantity: quantityNum,
      unitPrice: priceNum,
    });

    // Reset form
    setDescription('');
    setQuantity('1');
    setUnitPrice('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
      aria-label="Add invoice item form"
    >
      <h3 className="text-md font-semibold text-gray-900 mb-3">Add Item</h3>

      <div className="space-y-3">
        {/* Description */}
        <div>
          <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            id="itemDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product or service name"
            required
          />
        </div>

        {/* Quantity and Unit Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="itemQuantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="itemUnitPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price *
            </label>
            <input
              type="number"
              id="itemUnitPrice"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Item
        </button>
      </div>
    </form>
  );
};
