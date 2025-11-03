const express = require('express');
const { getWalletPnL, getWalletSummary } = require('../controllers/pnlController');

const router = express.Router();

/**
Get wallet PnL for date range
 */
router.get('/:wallet/pnl', getWalletPnL);

/**
 Get wallet summary (last 30 days)
 */
router.get('/:wallet/summary', getWalletSummary);

module.exports = router;

