# Token Insight & Analytics API

A production-ready MEN stack backend API for cryptocurrency token insights and HyperLiquid wallet profit & loss analytics.

## 📋 Overview

This API provides two main services:

1. **Token Insight API** - AI-powered cryptocurrency token analysis using CoinGecko data
2. **HyperLiquid Wallet PnL API** - Daily profit & loss tracking for HyperLiquid wallets

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (optional, for caching/logs)
- **Axios** - HTTP client for external APIs
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-reload
- **HuggingFace/OpenAI** - AI model integration
- **Docker** - Containerization

## 📁 Project Structure

```
token-insight-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB configuration
│   ├── controllers/
│   │   ├── tokenInsightController.js
│   │   └── pnlController.js
│   ├── routes/
│   │   ├── tokenRoutes.js
│   │   └── pnlRoutes.js
│   ├── services/
│   │   ├── coingeckoService.js   # CoinGecko API integration
│   │   ├── aiService.js          # AI insight generation
│   │   └── hyperliquidService.js # HyperLiquid PnL data
│   ├── utils/
│   │   ├── errorHandler.js       # Error handling utilities
│   │   ├── dateUtils.js          # Date manipulation
│   │   └── apiCache.js           # In-memory caching
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── .env                          # Environment variables (create from .env.example)
├── .env.example                  # Environment template
├── .dockerignore                 # Docker ignore patterns
├── Dockerfile                    # Docker configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (optional, for caching)
- Docker (optional, for containerization)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd token-insight-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # AI Configuration (choose one)
   AI_PROVIDER=HUGGINGFACE
   HUGGINGFACE_API_KEY=your_key_here
   
   # OR
   AI_PROVIDER=OPENAI
   OPENAI_API_KEY=your_key_here
   
   # CoinGecko (optional but recommended)
   COINGECKO_API_KEY=your_key_here
   
   # MongoDB (optional)
   MONGODB_URI=mongodb://localhost:27017/token-insight
   ```

4. **Run the server**
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 🐳 Docker Setup

### Build and Run with Docker

1. **Build Docker image**
   ```bash
   docker build -t token-insight-api .
   ```

2. **Run container**
   ```bash
   docker run -d \
     --name token-insight-api \
     -p 5000:5000 \
     --env-file .env \
     token-insight-api
   ```

3. **Check logs**
   ```bash
   docker logs -f token-insight-api
   ```

4. **Stop container**
   ```bash
   docker stop token-insight-api
   docker rm token-insight-api
   ```

### Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - AI_PROVIDER=HUGGINGFACE
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - MONGODB_URI=mongodb://mongo:27017/token-insight
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up -d
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-22T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

#### 2. Token Insight API

Generate AI-powered insights for any cryptocurrency token.

**Endpoint:**
```http
POST /api/token/:id/insight
```

**Parameters:**
- `id` (path) - CoinGecko token ID (e.g., `bitcoin`, `ethereum`)

**Request Body:**
```json
{
  "vs_currency": "usd",
  "history_days": 30
}
```

**Supported Currencies:** `usd`, `eur`, `gbp`, `jpy`, `btc`, `eth`

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{
    "vs_currency": "usd",
    "history_days": 30
  }'
```

**Example Response:**
```json
{
  "success": true,
  "source": "coingecko",
  "token": {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "market_data": {
      "current_price_usd": 68000,
      "market_cap_usd": 1340000000000,
      "total_volume_usd": 30000000,
      "price_change_percentage_24h": -0.5,
      "price_change_percentage_7d": 2.3,
      "price_change_percentage_30d": 15.7,
      "high_24h": 68500,
      "low_24h": 67500
    }
  },
  "insight": {
    "reasoning": "Bitcoin has shown moderate volatility with a slight correction in the last 24 hours but maintains positive momentum over the past week and month.",
    "sentiment": "Bullish"
  },
  "model": {
    "provider": "HUGGINGFACE",
    "model": "tiiuae/falcon-7b-instruct"
  },
  "metadata": {
    "generated_at": "2025-01-22T12:00:00.000Z",
    "vs_currency": "usd",
    "has_history": true
  }
}
```

---

#### 3. Wallet PnL API

Get daily profit & loss data for a HyperLiquid wallet.

**Endpoint:**
```http
GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD
```

**Parameters:**
- `wallet` (path) - Wallet address
- `start` (query, required) - Start date in YYYY-MM-DD format
- `end` (query, required) - End date in YYYY-MM-DD format

**Example Request:**
```bash
curl "http://localhost:5000/api/hyperliquid/0xabc123.../pnl?start=2025-01-01&end=2025-01-10"
```

**Example Response:**
```json
{
  "success": true,
  "wallet": "0xabc123...",
  "start": "2025-01-01",
  "end": "2025-01-03",
  "daily": [
    {
      "date": "2025-01-01",
      "realized_pnl_usd": 120.50,
      "unrealized_pnl_usd": -15.30,
      "fees_usd": 2.10,
      "funding_usd": -0.50,
      "net_pnl_usd": 102.60,
      "equity_usd": 10102.60
    },
    {
      "date": "2025-01-02",
      "realized_pnl_usd": 0.00,
      "unrealized_pnl_usd": -10.00,
      "fees_usd": 1.20,
      "funding_usd": -0.30,
      "net_pnl_usd": -11.50,
      "equity_usd": 10091.10
    }
  ],
  "summary": {
    "total_realized_usd": 120.50,
    "total_unrealized_usd": -25.30,
    "total_fees_usd": 3.30,
    "total_funding_usd": -0.80,
    "net_pnl_usd": 91.10
  },
  "diagnostics": {
    "data_source": "mock_data",
    "last_api_call": "2025-01-22T12:00:00.000Z",
    "notes": "PnL calculated using daily close prices"
  },
  "metadata": {
    "generated_at": "2025-01-22T12:00:00.000Z",
    "total_days": 3,
    "date_range_validated": true
  }
}
```

**Note:** Maximum date range is 90 days. Dates cannot be in the future.

---

#### 4. Wallet Summary API

Get wallet summary for the last 30 days.

**Endpoint:**
```http
GET /api/hyperliquid/:wallet/summary
```

**Example Request:**
```bash
curl http://localhost:5000/api/hyperliquid/0xabc123.../summary
```

**Example Response:**
```json
{
  "success": true,
  "wallet": "0xabc123...",
  "period": "30d",
  "summary": {
    "total_realized_usd": 1500.00,
    "total_unrealized_usd": -250.00,
    "total_fees_usd": 45.00,
    "total_funding_usd": -10.00,
    "net_pnl_usd": 1195.00
  },
  "metadata": {
    "generated_at": "2025-01-22T12:00:00.000Z"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `5000` | Server port |
| `MONGODB_URI` | No | `mongodb://localhost:27017/token-insight` | MongoDB connection string |
| `AI_PROVIDER` | Yes | `HUGGINGFACE` | AI provider (`HUGGINGFACE` or `OPENAI`) |
| `HUGGINGFACE_API_KEY` | If HuggingFace | - | HuggingFace API key |
| `HUGGINGFACE_MODEL` | No | `tiiuae/falcon-7b-instruct` | HuggingFace model name |
| `OPENAI_API_KEY` | If OpenAI | - | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-3.5-turbo` | OpenAI model name |
| `COINGECKO_API_KEY` | No | - | CoinGecko API key (recommended) |
| `HYPERLIQUID_API_URL` | No | `https://api.hyperliquid.xyz` | HyperLiquid API URL |
| `ALLOWED_ORIGINS` | No | `*` | CORS allowed origins (comma-separated) |

## 🧪 Testing

### Manual Testing

**Test Token Insight:**
```bash
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 7}'
```

**Test Wallet PnL:**
```bash
curl "http://localhost:5000/api/hyperliquid/0x1234567890abcdef/pnl?start=2025-01-01&end=2025-01-07"
```

**Test Health:**
```bash
curl http://localhost:5000/health
```

### Unit Tests (Optional)

```bash
npm test
```

## 📊 Performance & Caching

- **In-memory caching** for CoinGecko API responses (5-10 min TTL)
- **Connection pooling** for external APIs
- **Request validation** to prevent unnecessary API calls
- **Graceful error handling** with fallbacks

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** and sanitization
- **Rate limiting** support (via environment variables)
- **Non-root Docker user**
- **Environment variable protection**

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (external API failure)

## 📈 Future Improvements

- [ ] Add Redis caching for improved performance
- [ ] Implement rate limiting middleware
- [ ] Add comprehensive unit tests with Jest
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement WebSocket for real-time updates
- [ ] Add more AI model options
- [ ] Create Postman collection
- [ ] Add logging with Winston or Pino
- [ ] Implement API authentication
- [ ] Add database models for caching/logging
- [ ] Support for more exchanges (Binance, Coinbase Pro)
- [ ] Add historical data visualization endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🐛 Troubleshooting

**Issue:** "Cannot find module"
- **Solution:** Run `npm install` again

**Issue:** "MongoDB connection failed"
- **Solution:** MongoDB is optional. Check if you need it, or remove `MONGODB_URI` from `.env`

**Issue:** "AI service not working"
- **Solution:** Verify your API key in `.env` and ensure `AI_PROVIDER` is set correctly

**Issue:** "Port 5000 already in use"
- **Solution:** Change `PORT` in `.env` or kill the process using port 5000

**Issue:** Docker build fails
- **Solution:** Ensure Docker is running and check Docker logs

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Built with ❤️ using MEN Stack**

