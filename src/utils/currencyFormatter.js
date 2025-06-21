// src/utils/currencyFormatter.js

// Egyptian Pound currency formatting
export const formatEGP = (amount, options = {}) => {
  const {
    showSymbol = true,
    decimals = 2,
    locale = 'en-EG'
  } = options;

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    if (showSymbol) {
      return formatter.format(amount);
    } else {
      return formatter.format(amount).replace(/EGP\s?/, '').trim();
    }
  } catch (error) {
    console.log('Currency formatting error:', error);
    return `${amount?.toFixed?.(decimals) || '0.00'} EGP`;
  }
};

// Format price with EGP symbol
export const formatPrice = (amount, showFree = true) => {
  if (amount === 0 && showFree) {
    return 'Free';
  }
  return formatEGP(amount);
};

// Parse EGP string to number
export const parseEGP = (egpString) => {
  if (!egpString) return 0;
  
  // Remove currency symbols and spaces
  const cleaned = egpString.toString().replace(/[EGP\s,]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

// Format amount with thousand separators
export const formatNumber = (number, locale = 'en-EG') => {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.log('Number formatting error:', error);
    return number?.toString() || '0';
  }
};

// Currency conversion utilities (for future use)
export const currencyUtils = {
  // Add exchange rates if needed in future
  rates: {
    EGP: 1,
    USD: 0.032, // Example rate - should be fetched from API
    EUR: 0.029  // Example rate - should be fetched from API
  },
  
  convert: (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = currencyUtils.rates[fromCurrency] || 1;
    const toRate = currencyUtils.rates[toCurrency] || 1;
    
    return (amount / fromRate) * toRate;
  }
};

export default {
  formatEGP,
  formatPrice,
  parseEGP,
  formatNumber,
  currencyUtils
};