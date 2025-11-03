const express = require('express');
const { getWalletPnL, getWalletSummary } = require('../controllers/pnlController');

const router = express.Router();

/**
 * @route   GET /api/hyperliquid/:wallet/pnl
 * @desc    Get wallet PnL for date range
 * @access  Public
 * @query   start, end
 */
router.get('/:wallet/pnl', getWalletPnL);

/**
 * @route   GET /api/hyperliquid/:wallet/summary
 * @desc    Get wallet summary (last 30 days)
 * @access  Public
 */
router.get('/:wallet/summary', getWalletSummary);

module.exports = router;

