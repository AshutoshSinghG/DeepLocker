const axios = require('axios');

/**
 * AI Service for generating token insights using HuggingFace or OpenAI
 */
class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'HUGGINGFACE';
    this.huggingfaceKey = process.env.HUGGINGFACE_API_KEY;
    this.huggingfaceModel = process.env.HUGGINGFACE_MODEL || 'tiiuae/falcon-7b-instruct';
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Generate token insight using AI model
   * @param {Object} tokenData - Token market data
   * @returns {Promise<Object>} AI insight with reasoning and sentiment
   */
  async generateInsight(tokenData) {
    try {
      console.log(`🤖 Generating insight using ${this.provider}`);
      
      let result;
      
      switch (this.provider.toUpperCase()) {
        case 'HUGGINGFACE':
          result = await this.generateHuggingFaceInsight(tokenData);
          break;
        case 'OPENAI':
          result = await this.generateOpenAIInsight(tokenData);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
      
      return result;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      // Return fallback insight if AI service fails
      return this.getFallbackInsight(tokenData);
    }
  }

  /**
   * Generate insight using HuggingFace API
   * @param {Object} tokenData - Token market data
   * @returns {Promise<Object>} AI insight
   */
  async generateHuggingFaceInsight(tokenData) {
    if (!this.huggingfaceKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const prompt = this.buildPrompt(tokenData);
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${this.huggingfaceModel}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.huggingfaceKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    const generatedText = response.data[0]?.generated_text || '';
    return this.parseAIResponse(generatedText, tokenData);
  }

  /**
   * Generate insight using OpenAI API
   * @param {Object} tokenData - Token market data
   * @returns {Promise<Object>} AI insight
   */
  async generateOpenAIInsight(tokenData) {
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildPrompt(tokenData);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are a financial market analyst specializing in cryptocurrency token analysis. Provide concise, data-driven insights in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    return JSON.parse(content);
  }

  /**
   * Build AI prompt from token data
   * @param {Object} tokenData - Token market data
   * @returns {string} Formatted prompt
   */
  buildPrompt(tokenData) {
    const { market_data, name, symbol } = tokenData;
    
    return `Given the following token market data, provide a JSON response with two keys: "reasoning" and "sentiment". 

Token: ${name} (${symbol.toUpperCase()})
Current Price: $${market_data.current_price?.toLocaleString()}
Market Cap: $${market_data.market_cap?.toLocaleString()}
24h Volume: $${market_data.total_volume?.toLocaleString()}
24h Change: ${market_data.price_change_percentage_24h?.toFixed(2)}%
7d Change: ${market_data.price_change_percentage_7d?.toFixed(2)}%

Analyze the market sentiment and provide:
1. "reasoning": Brief explanation (2-3 sentences) of the market conditions
2. "sentiment": One of "Bullish", "Bearish", or "Neutral"

Respond ONLY with valid JSON, no additional text.`;
  }

  /**
   * Parse AI response and extract insights
   * @param {string} response - Raw AI response
   * @param {Object} tokenData - Token data for fallback
   * @returns {Object} Structured insight
   */
  parseAIResponse(response, tokenData) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        if (parsed.reasoning && parsed.sentiment) {
          return {
            reasoning: parsed.reasoning.substring(0, 500), // Limit length
            sentiment: parsed.sentiment,
          };
        }
      }
      
      // If JSON parsing fails, return fallback
      return this.getFallbackInsight(tokenData);
    } catch (error) {
      console.error('Error parsing AI response:', error.message);
      return this.getFallbackInsight(tokenData);
    }
  }

  /**
   * Get fallback insight when AI service fails
   * @param {Object} tokenData - Token data
   * @returns {Object} Fallback insight
   */
  getFallbackInsight(tokenData) {
    const { market_data } = tokenData;
    const change24h = market_data.price_change_percentage_24h || 0;
    
    let sentiment = 'Neutral';
    if (change24h > 5) sentiment = 'Bullish';
    else if (change24h < -5) sentiment = 'Bearish';
    
    const reasoning = `The token shows ${Math.abs(change24h).toFixed(2)}% ${change24h >= 0 ? 'gain' : 'loss'} in the last 24 hours. Market cap of $${(market_data.market_cap / 1e9).toFixed(2)}B indicates ${market_data.market_cap > 10e9 ? 'high' : 'moderate'} market capitalization.`;
    
    return {
      reasoning,
      sentiment,
    };
  }
}

module.exports = new AIService();

