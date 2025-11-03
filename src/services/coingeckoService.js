const axios = require('axios');
const cache = require('../utils/apiCache');

/**
 * CoinGecko API service for fetching token data
 */
class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.apiKey = process.env.COINGECKO_API_KEY;
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: this.apiKey ? { 'x-cg-demo-api-key': this.apiKey } : {},
    });
  }

  /**
   * Fetch token metadata and market data
   * @param {string} tokenId - CoinGecko token ID (e.g., 'bitcoin', 'ethereum')
   * @param {string} vsCurrency - Base currency (default: 'usd')
   * @returns {Promise<Object>} Token data
   */
  async getTokenData(tokenId, vsCurrency = 'usd') {
    try {
      const cacheKey = `coingecko_token_${tokenId}_${vsCurrency}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log(`📦 Cache hit for token: ${tokenId}`);
        return cached;
      }

      console.log(`🌐 Fetching token data for: ${tokenId}`);
      
      const response = await this.client.get(`/coins/${tokenId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      });

      const tokenData = this.transformTokenData(response.data, vsCurrency);
      
      // Cache for 5 minutes
      cache.set(cacheKey, tokenData, 5 * 60 * 1000);
      
      return tokenData;
    } catch (error) {
      if (error.response) {
        throw new Error(`CoinGecko API error: ${error.response.status} - ${error.response.statusText}`);
      }
      throw new Error(`Failed to fetch token data: ${error.message}`);
    }
  }

  /**
   * Fetch market chart data for historical price data
   * @param {string} tokenId - CoinGecko token ID
   * @param {number} days - Number of days of history
   * @param {string} vsCurrency - Base currency (default: 'usd')
   * @returns {Promise<Object>} Market chart data
   */
  async getMarketChart(tokenId, days = 30, vsCurrency = 'usd') {
    try {
      const cacheKey = `coingecko_chart_${tokenId}_${days}_${vsCurrency}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await this.client.get(`/coins/${tokenId}/market_chart`, {
        params: {
          vs_currency: vsCurrency,
          days: days,
          interval: days <= 1 ? 'hourly' : 'daily',
        },
      });

      // Cache for 10 minutes
      cache.set(cacheKey, response.data, 10 * 60 * 1000);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`CoinGecko API error: ${error.response.status} - ${error.response.statusText}`);
      }
      throw new Error(`Failed to fetch market chart: ${error.message}`);
    }
  }

  /**
   * Transform CoinGecko API response to standardized format
   * @param {Object} data - Raw CoinGecko data
   * @param {string} vsCurrency - Base currency
   * @returns {Object} Transformed data
   */
  transformTokenData(data, vsCurrency = 'usd') {
    const marketData = data.market_data;
    
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      description: data.description?.en || 'No description available',
      image: data.image?.large || data.image?.small || '',
      market_data: {
        current_price: marketData.current_price?.[vsCurrency] || 0,
        market_cap: marketData.market_cap?.[vsCurrency] || 0,
        total_volume: marketData.total_volume?.[vsCurrency] || 0,
        price_change_percentage_24h: marketData.price_change_percentage_24h || 0,
        price_change_percentage_7d: marketData.price_change_percentage_7d || 0,
        price_change_percentage_30d: marketData.price_change_percentage_30d || 0,
        high_24h: marketData.high_24h?.[vsCurrency] || 0,
        low_24h: marketData.low_24h?.[vsCurrency] || 0,
        circulating_supply: marketData.circulating_supply || 0,
        total_supply: marketData.total_supply || 0,
        max_supply: marketData.max_supply || null,
        ath: marketData.ath?.[vsCurrency] || 0,
        ath_change_percentage: marketData.ath_change_percentage?.[vsCurrency] || 0,
        atl: marketData.atl?.[vsCurrency] || 0,
        atl_change_percentage: marketData.atl_change_percentage?.[vsCurrency] || 0,
      },
      metadata: {
        coingecko_rank: data.market_cap_rank || null,
        categories: data.categories || [],
      },
    };
  }

  /**
   * Get token data with market chart
   * @param {string} tokenId - CoinGecko token ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Combined token data
   */
  async getTokenWithHistory(tokenId, params = {}) {
    const { vs_currency = 'usd', history_days = 30 } = params;
    
    const [tokenData, chartData] = await Promise.all([
      this.getTokenData(tokenId, vs_currency),
      this.getMarketChart(tokenId, history_days, vs_currency),
    ]);

    return {
      ...tokenData,
      price_history: chartData,
    };
  }
}

module.exports = new CoinGeckoService();

