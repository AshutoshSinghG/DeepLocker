const express = require('express');
const { generateTokenInsight } = require('../controllers/tokenInsightController');

const router = express.Router();

/**Get AI-powered token insight
 */
router.post('/:id/insight', generateTokenInsight);

module.exports = router;

