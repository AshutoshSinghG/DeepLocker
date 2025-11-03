const coinGeckoService = require('../services/coingeckoService');
const aiService = require('../services/aiService');
const { AppError, asyncHandler } = require('../utils/errorHandler');

/**
 * Generate token insight with AI analysis
 * @route POST /api/token/:id/insight
 */
const generateTokenInsight = asyncHandler(async (req, res) => {
  const { id: tokenId } = req.params;
  const { vs_currency = 'usd', history_days = 30 } = req.body;

  // Validate inputs
  if (!tokenId) {
    throw new AppError('Token ID is required', 400);
  }

  if (!['usd', 'eur', 'gbp', 'jpy', 'btc', 'eth'].includes(vs_currency.toLowerCase())) {
    throw new AppError('Invalid vs_currency. Supported: usd, eur, gbp, jpy, btc, eth', 400);
  }

  if (history_days < 1 || history_days > 365) {
    throw new AppError('history_days must be between 1 and 365', 400);
  }

  try {
    console.log(`🔍 Generating insight for token: ${tokenId}`);
    
    // Fetch token data from CoinGecko
    const tokenData = await coinGeckoService.getTokenData(tokenId, vs_currency);
    
    // Optionally fetch historical data if requested
    let priceHistory = null;
    if (history_days > 0) {
      priceHistory = await coinGeckoService.getMarketChart(tokenId, history_days, vs_currency);
    }

    // Generate AI insight
    const insight = await aiService.generateInsight(tokenData);
    
    // Determine which AI model was used
    let modelInfo = {
      provider: process.env.AI_PROVIDER || 'HUGGINGFACE',
      model: process.env.HUGGINGFACE_MODEL || process.env.OPENAI_MODEL || 'fallback',
    };

    // Build response
    const response = {
      success: true,
      source: 'coingecko',
      token: {
        id: tokenData.id,
        symbol: tokenData.symbol,
        name: tokenData.name,
        market_data: {
          current_price_usd: parseFloat(tokenData.market_data.current_price?.toFixed(2)) || 0,
          market_cap_usd: parseFloat(tokenData.market_data.market_cap?.toFixed(2)) || 0,
          total_volume_usd: parseFloat(tokenData.market_data.total_volume?.toFixed(2)) || 0,
          price_change_percentage_24h: parseFloat(tokenData.market_data.price_change_percentage_24h?.toFixed(2)) || 0,
          price_change_percentage_7d: parseFloat(tokenData.market_data.price_change_percentage_7d?.toFixed(2)) || 0,
          price_change_percentage_30d: parseFloat(tokenData.market_data.price_change_percentage_30d?.toFixed(2)) || 0,
          high_24h: parseFloat(tokenData.market_data.high_24h?.toFixed(2)) || 0,
          low_24h: parseFloat(tokenData.market_data.low_24h?.toFixed(2)) || 0,
        },
      },
      insight: {
        reasoning: insight.reasoning,
        sentiment: insight.sentiment,
      },
      model: modelInfo,
      metadata: {
        generated_at: new Date().toISOString(),
        vs_currency,
        has_history: !!priceHistory,
      },
    };

    // Add historical data if available
    if (priceHistory) {
      response.token.price_history = {
        prices: priceHistory.prices || [],
        market_caps: priceHistory.market_caps || [],
        total_volumes: priceHistory.total_volumes || [],
        days: history_days,
      };
    }

    console.log(`✅ Insight generated successfully for: ${tokenId}`);
    
    res.status(200).json(response);
  } catch (error) {
    if (error.message.includes('404') || error.message.includes('not found')) {
      throw new AppError(`Token '${tokenId}' not found on CoinGecko`, 404);
    }
    
    console.error('Error generating token insight:', error);
    throw error;
  }
});

module.exports = {
  generateTokenInsight,
};

