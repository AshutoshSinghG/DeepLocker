const hyperliquidService = require('../services/hyperliquidService');
const { AppError, asyncHandler } = require('../utils/errorHandler');
const { 
  parseDate, 
  validateDateRange,
  getCurrentDate,
} = require('../utils/dateUtils');

/**
 * Get wallet PnL data for a date range
 */
const getWalletPnL = asyncHandler(async (req, res) => {
  const { wallet } = req.params;
  const { start, end } = req.query;

  // Validate wallet address
  if (!wallet || wallet.length < 10) {
    throw new AppError('Valid wallet address is required', 400);
  }

  // Validate dates
  if (!start || !end) {
    throw new AppError('Both start and end dates are required (YYYY-MM-DD)', 400);
  }

  // Validate date format
  let startDate, endDate;
  try {
    startDate = parseDate(start);
    endDate = parseDate(end);
  } catch (error) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
  }

  // Validate date range
  if (endDate < startDate) {
    throw new AppError('End date must be after start date', 400);
  }

  // Check if dates are in the future
  const currentDate = new Date(getCurrentDate());
  if (startDate > currentDate) {
    throw new AppError('Start date cannot be in the future', 400);
  }

  // Validate date range length (max 90 days)
  if (!validateDateRange(start, end, 90)) {
    throw new AppError('Date range cannot exceed 90 days', 400);
  }

  // Format dates back to YYYY-MM-DD for service layer
  const formatDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStart = formatDateStr(startDate);
  const formattedEnd = formatDateStr(endDate);

  try {
    console.log(`Fetching PnL for wallet: ${wallet.substring(0, 15)}...`);
    
    const pnlData = await hyperliquidService.getWalletPnL(wallet, formattedStart, formattedEnd);
    
    // Add API metadata
    const response = {
      success: true,
      ...pnlData,
      metadata: {
        generated_at: new Date().toISOString(),
        total_days: pnlData.daily.length,
        date_range_validated: true,
      },
    };

    console.log(`PnL data fetched successfully`);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching wallet PnL:', error);
    throw error;
  }
});

/**
 * Get wallet summary
 */
const getWalletSummary = asyncHandler(async (req, res) => {
  const { wallet } = req.params;

  if (!wallet || wallet.length < 10) {
    throw new AppError('Valid wallet address is required', 400);
  }

  // Get last 30 days of data
  const endDate = getCurrentDate();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const formattedStart = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

  const pnlData = await hyperliquidService.getWalletPnL(wallet, formattedStart, endDate);
  const { summary } = pnlData;

  res.status(200).json({
    success: true,
    wallet,
    period: '30d',
    summary,
    metadata: {
      generated_at: new Date().toISOString(),
    },
  });
});

module.exports = {
  getWalletPnL,
  getWalletSummary,
};

