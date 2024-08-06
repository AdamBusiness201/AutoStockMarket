// utils/numberUtils.js
export function formatNumber(value) {
    // Check if value is actually a number or can be converted to a number
    if (!isNaN(value) && value !== null && value !== undefined && value !== '') {
      const numberValue = parseFloat(value);
      // Check if the parsed value is an integer
      if (Number.isInteger(numberValue)) {
        return numberValue.toString();
      } else {
        return numberValue.toFixed(2);
      }
    } else {
      // If value is not a number, return it as is
      return value;
    }
  }
  