// utils/numberUtils.js
export function formatNumber(value, locale = 'en-US') {
  // Check if value is actually a number or can be converted to a number
  if (!isNaN(value) && value !== null && value !== undefined && value !== '') {
    const numberValue = parseFloat(value);

    // Create a NumberFormat instance for the locale
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: Number.isInteger(numberValue) ? 0 : 2, // Show decimals only for non-integers
      maximumFractionDigits: 2 // Limit to 2 decimal places
    });

    return formatter.format(numberValue);
  } else {
    // If value is not a number, return it as is
    return value;
  }
}
