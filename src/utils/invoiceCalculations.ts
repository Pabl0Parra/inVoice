import type { InvoiceItem, InvoiceData } from '../types';

/**
 * Invoice calculation utilities
 * Pure functions for calculating invoice totals and related values
 */

/**
 * Calculate the total for a single invoice item
 *
 * @param quantity - Item quantity
 * @param unitPrice - Price per unit
 * @returns Total price for the item
 */
export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * Calculate subtotal from array of invoice items
 *
 * @param items - Array of invoice items
 * @returns Subtotal (sum of all item totals)
 */
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

/**
 * Calculate tax amount from subtotal and tax rate
 *
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate as decimal (e.g., 0.10 for 10%)
 * @returns Tax amount
 */
export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * taxRate;
};

/**
 * Calculate final total including tax
 *
 * @param subtotal - Subtotal amount
 * @param tax - Tax amount
 * @returns Final total
 */
export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

/**
 * Calculate all invoice totals at once
 *
 * @param items - Array of invoice items
 * @param taxRate - Tax rate as decimal
 * @returns Object with subtotal, tax, and total
 */
export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  taxRate: number
): Pick<InvoiceData, 'subtotal' | 'tax' | 'total'> => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax);

  return { subtotal, tax, total };
};

/**
 * Format currency for display
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format percentage for display
 *
 * @param rate - Rate as decimal (e.g., 0.10 for 10%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (rate: number, decimals: number = 1): string => {
  return `${(rate * 100).toFixed(decimals)}%`;
};

/**
 * Round to 2 decimal places (standard for currency)
 *
 * @param value - Value to round
 * @returns Rounded value
 */
export const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};
