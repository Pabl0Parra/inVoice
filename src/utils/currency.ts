import { type Language } from '../locales/translations';

/**
 * Get the currency symbol for a given language
 * @param language - The current language
 * @returns The currency symbol ('$' or '€')
 */
export const getCurrencySymbol = (language: Language): string => {
  return language === 'es' ? '€' : '$';
};

/**
 * Format a number as a currency string
 * @param amount - The amount to format
 * @param language - The current language
 * @returns Formatted currency string (e.g., "$1,234.56" or "1.234,56 €")
 */
export const formatCurrency = (amount: number, language: Language): string => {
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  const currency = language === 'es' ? 'EUR' : 'USD';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
