const express = require('express');
const { generateTokenInsight } = require('../controllers/tokenInsightController');

const router = express.Router();

/**
 * @route   POST /api/token/:id/insight
 * @desc    Get AI-powered token insight
 * @access  Public
 * @body    { vs_currency, history_days }
 */
router.post('/:id/insight', generateTokenInsight);

module.exports = router;

