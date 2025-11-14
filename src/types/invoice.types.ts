/**
 * Invoice-related type definitions
 */

/**
 * Represents a single line item in an invoice
 */
export interface InvoiceItem {
  /** Unique identifier for the item */
  id: string;
  /** Description of the product or service */
  description: string;
  /** Quantity of items */
  quantity: number;
  /** Price per unit */
  unitPrice: number;
  /** Calculated total (quantity * unitPrice) */
  total: number;
}

/**
 * Complete invoice data structure
 */
export interface InvoiceData {
  /** Unique invoice number/identifier */
  invoiceNumber: string;
  /** Date the invoice was created */
  date: Date;
  /** Payment due date */
  dueDate: Date;
  /** Customer's full name */
  customerName: string;
  /** Customer's billing address */
  customerAddress: string;
  /** Array of invoice line items */
  items: InvoiceItem[];
  /** Sum of all items before tax */
  subtotal: number;
  /** Tax amount calculated from subtotal and tax rate */
  tax: number;
  /** Tax rate as a decimal (e.g., 0.10 for 10%) */
  taxRate: number;
  /** Final total including tax */
  total: number;
  /** Optional notes or terms */
  notes?: string;
}

/**
 * Action types for invoice state management with useReducer
 */
export type InvoiceAction =
  | { type: 'ADD_ITEM'; payload: Omit<InvoiceItem, 'id' | 'total'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: InvoiceItem }
  | { type: 'SET_CUSTOMER'; payload: Pick<InvoiceData, 'customerName' | 'customerAddress'> }
  | { type: 'SET_TAX_RATE'; payload: number }
  | { type: 'SET_INVOICE_NUMBER'; payload: string }
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_DUE_DATE'; payload: Date }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET_INVOICE' };

/**
 * Initial state for a new invoice
 */
export const initialInvoiceState: InvoiceData = {
  invoiceNumber: '',
  date: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  customerName: '',
  customerAddress: '',
  items: [],
  subtotal: 0,
  tax: 0,
  taxRate: 0,
  total: 0,
  notes: '',
};
