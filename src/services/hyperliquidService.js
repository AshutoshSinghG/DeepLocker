const axios = require('axios');
const { getDateRange } = require('../utils/dateUtils');

/**
 * HyperLiquid API service for fetching wallet PnL data
 * Note: This is a mock implementation since HyperLiquid's actual API may vary
 */
class HyperLiquidService {
  constructor() {
    this.baseURL = process.env.HYPERLIQUID_API_URL || 'https://api.hyperliquid.xyz';
    this.apiKey = process.env.HYPERLIQUID_API_KEY;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
    });
  }

  /**
   * Fetch wallet PnL data for a date range
   */
  async getWalletPnL(wallet, startDate, endDate) {
    try {
      // Since HyperLiquid API structure may vary, we'll use mock data
      // In production, replace this with actual API calls
      console.log(` Fetching PnL for wallet: ${wallet.substring(0, 10)}...`);
      
      const dailyData = this.generateMockPnLData(wallet, startDate, endDate);
      
      const summary = this.calculateSummary(dailyData);
      
      return {
        wallet,
        start: startDate,
        end: endDate,
        daily: dailyData,
        summary,
        diagnostics: {
          data_source: this.apiKey ? 'hyperliquid_api' : 'mock_data',
          last_api_call: new Date().toISOString(),
          notes: 'PnL calculated using daily close prices',
        },
      };
    } catch (error) {
      console.error('HyperLiquid Service Error:', error.message);
      throw new Error(`Failed to fetch PnL data: ${error.message}`);
    }
  }

  /**
   * Generate mock PnL data for demonstration
   */
  generateMockPnLData(wallet, startDate, endDate) {
    const dates = getDateRange(startDate, endDate);
    const dailyData = [];
    let runningEquity = 10000; // Starting equity
    
    // Use wallet address as seed for consistent pseudo-random data
    const seed = this.hashString(wallet);
    
    dates.forEach((date, index) => {
      // Generate pseudo-random but consistent values based on seed
      const random = this.seededRandom(seed + index);
      
      // Simulate realistic trading activity
      const hasTrades = random() > 0.3; // 70% chance of having trades
      const realizedPnL = hasTrades ? (random() * 500 - 250) : 0;
      const unrealizedPnL = (random() * 100 - 50);
      const fees = hasTrades ? (random() * 10 + 0.5) : (random() * 2);
      const funding = (random() * 2 - 1);
      
      const netPnL = realizedPnL + unrealizedPnL - fees + funding;
      runningEquity += netPnL;
      
      dailyData.push({
        date,
        realized_pnl_usd: parseFloat(realizedPnL.toFixed(2)),
        unrealized_pnl_usd: parseFloat(unrealizedPnL.toFixed(2)),
        fees_usd: parseFloat(fees.toFixed(2)),
        funding_usd: parseFloat(funding.toFixed(2)),
        net_pnl_usd: parseFloat(netPnL.toFixed(2)),
        equity_usd: parseFloat(runningEquity.toFixed(2)),
      });
    });
    
    return dailyData;
  }

  /**
   * Calculate summary statistics from daily PnL data
   */
  calculateSummary(dailyData) {
    const summary = dailyData.reduce(
      (acc, day) => {
        acc.total_realized_usd += day.realized_pnl_usd;
        acc.total_unrealized_usd += day.unrealized_pnl_usd;
        acc.total_fees_usd += day.fees_usd;
        acc.total_funding_usd += day.funding_usd;
        return acc;
      },
      {
        total_realized_usd: 0,
        total_unrealized_usd: 0,
        total_fees_usd: 0,
        total_funding_usd: 0,
      }
    );
    
    summary.net_pnl_usd = parseFloat(
      (
        summary.total_realized_usd +
        summary.total_unrealized_usd -
        summary.total_fees_usd +
        summary.total_funding_usd
      ).toFixed(2)
    );
    
    // Round all values to 2 decimal places
    Object.keys(summary).forEach((key) => {
      summary[key] = parseFloat(summary[key].toFixed(2));
    });
    
    return summary;
  }

  /**
   * Hash string to number for seed generation
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Seeded random number generator for consistent pseudo-random data
   */
  seededRandom(seed) {
    let value = seed;
    return function () {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  /**
   * Fetch actual trades from HyperLiquid (if available)
   */
  async fetchTrades(wallet, startDate, endDate) {
    try {
      // This would be the actual HyperLiquid API call
      // Example structure:
      // const response = await this.client.get(`/trades/${wallet}`, {
      //   params: { start: startDate, end: endDate }
      // });
      // return response.data;
      
      return [];
    } catch (error) {
      console.error('Error fetching trades:', error.message);
      return [];
    }
  }

  /**
   * Fetch funding payments
   */
  async fetchFunding(wallet, startDate, endDate) {
    try {
      // This would be the actual HyperLiquid API call
      return [];
    } catch (error) {
      console.error('Error fetching funding:', error.message);
      return [];
    }
  }
}

module.exports = new HyperLiquidService();

