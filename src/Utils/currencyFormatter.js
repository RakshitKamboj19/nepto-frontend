/**
 * Utility function to format prices in Indian Rupees (₹)
 * 
 * @param {number} price - The price to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted price in Indian Rupees
 */
export const formatPrice = (price, showSymbol = true) => {
  // Convert USD to INR (approximate conversion rate)
  const inrPrice = price * 82.5;
  
  // Format the price with Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(inrPrice);
};

/**
 * Utility function to format prices in USD ($)
 * For reference or if needed in the future
 */
export const formatPriceUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};
