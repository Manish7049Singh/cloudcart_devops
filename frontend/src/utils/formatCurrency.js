/**
 * Format numeric value to standard USD currency string.
 * @param {number|string} amount
 * @returns {string} Formatted string like $129.99
 */
export const formatCurrency = (amount) => {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(numeric)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

/**
 * Format discount percentage badge.
 * @param {number} discount
 * @returns {string} Formatted string like "-15%"
 */
export const formatDiscount = (discount) => {
  if (!discount || discount <= 0) return null;
  return `-${Math.round(discount)}%`;
};
