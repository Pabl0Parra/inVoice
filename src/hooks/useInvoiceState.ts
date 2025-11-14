import { useReducer, useCallback, useMemo } from 'react';
import type { InvoiceData, InvoiceAction, InvoiceItem } from '../types';
import { initialInvoiceState } from '../types';

/**
 * Invoice reducer function
 * Handles all invoice state updates with proper calculations
 */
const invoiceReducer = (state: InvoiceData, action: InvoiceAction): InvoiceData => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: InvoiceItem = {
        id: crypto.randomUUID(),
        ...action.payload,
        total: action.payload.quantity * action.payload.unitPrice,
      };

      const newItems = [...state.items, newItem];
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * state.taxRate;
      const total = subtotal + tax;

      return {
        ...state,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * state.taxRate;
      const total = subtotal + tax;

      return {
        ...state,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    }

    case 'UPDATE_ITEM': {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...action.payload, total: action.payload.quantity * action.payload.unitPrice }
          : item
      );

      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * state.taxRate;
      const total = subtotal + tax;

      return {
        ...state,
        items: newItems,
        subtotal,
        tax,
        total,
      };
    }

    case 'SET_CUSTOMER':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_TAX_RATE': {
      const tax = state.subtotal * action.payload;
      const total = state.subtotal + tax;

      return {
        ...state,
        taxRate: action.payload,
        tax,
        total,
      };
    }

    case 'SET_INVOICE_NUMBER':
      return {
        ...state,
        invoiceNumber: action.payload,
      };

    case 'SET_DATE':
      return {
        ...state,
        date: action.payload,
      };

    case 'SET_DUE_DATE':
      return {
        ...state,
        dueDate: action.payload,
      };

    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };

    case 'RESET_INVOICE':
      return initialInvoiceState;

    default:
      return state;
  }
};

/**
 * Return type for useInvoiceState hook
 */
interface UseInvoiceStateReturn {
  /** Current invoice data */
  invoiceData: InvoiceData;
  /** Dispatch function for invoice actions */
  dispatch: React.Dispatch<InvoiceAction>;
  /** Helper: Add a new item */
  addItem: (item: Omit<InvoiceItem, 'id' | 'total'>) => void;
  /** Helper: Remove an item by ID */
  removeItem: (itemId: string) => void;
  /** Helper: Update an existing item */
  updateItem: (item: InvoiceItem) => void;
  /** Helper: Set customer details */
  setCustomer: (name: string, address: string) => void;
  /** Helper: Set tax rate (as decimal, e.g., 0.10 for 10%) */
  setTaxRate: (rate: number) => void;
  /** Helper: Reset invoice to initial state */
  resetInvoice: () => void;
}

/**
 * Custom hook for managing invoice state with useReducer
 * Provides state and helper functions for invoice operations
 * Automatically recalculates totals when items or tax rate changes
 *
 * @returns Invoice state and helper functions
 */
export const useInvoiceState = (): UseInvoiceStateReturn => {
  const [invoiceData, dispatch] = useReducer(invoiceReducer, initialInvoiceState);

  // Helper functions for common operations
  const addItem = useCallback((item: Omit<InvoiceItem, 'id' | 'total'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateItem = useCallback((item: InvoiceItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);

  const setCustomer = useCallback((customerName: string, customerAddress: string) => {
    dispatch({ type: 'SET_CUSTOMER', payload: { customerName, customerAddress } });
  }, []);

  const setTaxRate = useCallback((rate: number) => {
    dispatch({ type: 'SET_TAX_RATE', payload: rate });
  }, []);

  const resetInvoice = useCallback(() => {
    dispatch({ type: 'RESET_INVOICE' });
  }, []);

  return useMemo(
    () => ({
      invoiceData,
      dispatch,
      addItem,
      removeItem,
      updateItem,
      setCustomer,
      setTaxRate,
      resetInvoice,
    }),
    [invoiceData, addItem, removeItem, updateItem, setCustomer, setTaxRate, resetInvoice]
  );
};
