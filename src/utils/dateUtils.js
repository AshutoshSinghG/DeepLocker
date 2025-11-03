/**
 * Date utility functions for handling date operations
 */

/**
 * Parse date string to Date object
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} Parsed date object
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  
  return date;
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object');
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get date range between start and end dates
 * @param {string} start - Start date in YYYY-MM-DD format
 * @param {string} end - End date in YYYY-MM-DD format
 * @returns {Array<string>} Array of date strings
 */
const getDateRange = (start, end) => {
  const dates = [];
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  
  if (startDate > endDate) {
    throw new Error('Start date must be before or equal to end date');
  }
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(formatDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * Validate date range (max 90 days)
 * @param {string} start - Start date in YYYY-MM-DD format
 * @param {string} end - End date in YYYY-MM-DD format
 * @param {number} maxDays - Maximum allowed days (default: 90)
 * @returns {boolean} True if valid
 */
const validateDateRange = (start, end, maxDays = 90) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= maxDays;
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
const getCurrentDate = () => {
  return formatDate(new Date());
};

module.exports = {
  parseDate,
  formatDate,
  getDateRange,
  validateDateRange,
  getCurrentDate,
};

