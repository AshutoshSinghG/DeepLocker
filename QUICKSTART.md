# 🚀 Quick Start Guide

Get up and running with the Token Insight & Analytics API in under 5 minutes!

## Option 1: Local Development (Recommended for first-time setup)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add at least one AI API key:

**For HuggingFace:**
```env
AI_PROVIDER=HUGGINGFACE
HUGGINGFACE_API_KEY=your_key_here
```

**OR for OpenAI:**
```env
AI_PROVIDER=OPENAI
OPENAI_API_KEY=your_key_here
```

Get free API keys:
- HuggingFace: https://huggingface.co/settings/tokens
- OpenAI: https://platform.openai.com/api-keys
- CoinGecko (optional): https://www.coingecko.com/en/api

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
🚀 Token Insight & Analytics API Server Running
📍 Environment: development
🌐 Server: http://localhost:5000
```

### Step 4: Test It Out!

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Bitcoin Insight:**
```bash
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 7}'
```

**Get Wallet PnL:**
```bash
curl "http://localhost:5000/api/hyperliquid/0x123/pnl?start=2025-01-01&end=2025-01-07"
```

## Option 2: Docker (Quickest)

### Step 1: Set Up Environment
```bash
cp .env.example .env
# Edit .env with your API keys
```

### Step 2: Run with Docker
```bash
docker-compose up -d
```

### Step 3: View Logs
```bash
docker-compose logs -f api
```

### Step 4: Test
```bash
curl http://localhost:5000/health
```

### Stop Everything
```bash
docker-compose down
```

## Option 3: Docker without Compose

### Step 1: Build Image
```bash
docker build -t token-insight-api .
```

### Step 2: Run Container
```bash
docker run -d \
  --name token-api \
  -p 5000:5000 \
  --env-file .env \
  token-insight-api
```

### Step 3: Test
```bash
curl http://localhost:5000/health
```

### Step 4: Stop
```bash
docker stop token-api
docker rm token-api
```

## 📝 Test Examples

### 1. Check Server Health
```bash
curl http://localhost:5000/health
```

### 2. Get Token Insights

**Bitcoin:**
```bash
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd"}'
```

**Ethereum:**
```bash
curl -X POST http://localhost:5000/api/token/ethereum/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 30}'
```

**Solana:**
```bash
curl -X POST http://localhost:5000/api/token/solana/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 7}'
```

### 3. Get Wallet PnL

**7 days:**
```bash
curl "http://localhost:5000/api/hyperliquid/0xabc/pnl?start=2025-01-01&end=2025-01-07"
```

**30 days:**
```bash
curl "http://localhost:5000/api/hyperliquid/0xabc/pnl?start=2024-12-01&end=2024-12-31"
```

**Summary:**
```bash
curl http://localhost:5000/api/hyperliquid/0xabc/summary
```

## 🔧 Troubleshooting

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Port 5000 in use"**
Edit `.env` and change `PORT=5000` to `PORT=5001`

**"AI service not working"**
- Verify API key is in `.env`
- Check `AI_PROVIDER` is set to either `HUGGINGFACE` or `OPENAI`
- Free tiers may have rate limits

**"MongoDB connection failed"**
- MongoDB is optional! The app will work without it
- Remove `MONGODB_URI` from `.env` if you don't need it

**Docker issues**
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build  # Rebuild
```

## 📚 Next Steps

- Read full documentation in [README.md](./README.md)
- Import [postman_collection.json](./postman_collection.json) into Postman
- Customize API keys and configuration in `.env`
- Deploy to production (see README.md)

## 🎉 Success!

If you see the health check returning JSON, you're all set! Happy coding! 🚀

