# ✅ Setup Checklist

Use this checklist to verify your Token Insight & Analytics API is properly configured.

## 📋 Pre-Installation

- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed
- [ ] Git installed (optional)
- [ ] Code editor ready (VS Code recommended)

## 🔧 Installation Steps

- [ ] Cloned/downloaded the project
- [ ] Opened terminal in project directory
- [ ] Ran `npm install`
- [ ] Copied `.env.example` to `.env`
- [ ] Edited `.env` with API keys

## 🔑 API Keys Configuration

**Required for Token Insight API:**
- [ ] HuggingFace API key added OR
- [ ] OpenAI API key added
- [ ] `AI_PROVIDER` set to `HUGGINGFACE` or `OPENAI`

**Optional but Recommended:**
- [ ] CoinGecko API key added
- [ ] MongoDB installed and running (optional)

**For HyperLiquid PnL:**
- [ ] API works with mock data (no key needed for testing)

## 🚀 Running the Server

**Option 1: Local Development**
- [ ] Run `npm run dev`
- [ ] Server starts without errors
- [ ] Port 5000 is accessible
- [ ] Health check works: `curl http://localhost:5000/health`

**Option 2: Docker**
- [ ] Docker installed and running
- [ ] Run `docker-compose up -d`
- [ ] Container starts successfully
- [ ] Check logs: `docker-compose logs -f`

## 🧪 Testing

**Health Check**
- [ ] `GET /health` returns 200 OK
- [ ] Response has status, timestamp, uptime

**Token Insight API**
- [ ] `POST /api/token/bitcoin/insight` returns data
- [ ] AI sentiment is generated
- [ ] Market data is included
- [ ] Tried with different tokens (ethereum, solana)

**Wallet PnL API**
- [ ] `GET /api/hyperliquid/0xabc/pnl?start=2025-01-01&end=2025-01-07` works
- [ ] Daily PnL data is returned
- [ ] Summary statistics are correct
- [ ] Wallet summary endpoint works

**Error Handling**
- [ ] Invalid token ID returns 404
- [ ] Invalid date format returns 400
- [ ] Date range > 90 days returns 400
- [ ] Missing parameters handled gracefully

## 📊 Verification Tests

Run these commands to verify everything works:

```bash
# Health check
curl http://localhost:5000/health

# Token insight - Bitcoin
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd"}'

# Token insight - Ethereum
curl -X POST http://localhost:5000/api/token/ethereum/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 7}'

# Wallet PnL - 7 days
curl "http://localhost:5000/api/hyperliquid/0xabc/pnl?start=2025-01-01&end=2025-01-07"

# Wallet summary
curl http://localhost:5000/api/hyperliquid/0xabc/summary
```

## 🐳 Docker Verification

- [ ] `docker ps` shows running containers
- [ ] `docker logs token-insight-api` shows startup logs
- [ ] `docker-compose down` stops containers cleanly
- [ ] Port 5000 is accessible from host

## 📚 Documentation

- [ ] README.md reviewed
- [ ] QUICKSTART.md followed
- [ ] PROJECT_OVERVIEW.md understood
- [ ] Postman collection imported (optional)
- [ ] API endpoints documented

## 🔍 Common Issues

**"Cannot find module"**
- [ ] Deleted `node_modules` and `package-lock.json`
- [ ] Ran `npm install` again

**"Port 5000 in use"**
- [ ] Changed PORT in `.env` to different port
- [ ] Killed process using port 5000

**"AI service not working"**
- [ ] API key is valid and added to `.env`
- [ ] `AI_PROVIDER` set correctly
- [ ] Tried the fallback insight

**"MongoDB connection failed"**
- [ ] MongoDB is optional - app works without it
- [ ] Removed `MONGODB_URI` if not using MongoDB
- [ ] MongoDB is running if you want to use it

## ✅ Final Verification

Everything working?
- [ ] All API endpoints respond correctly
- [ ] No console errors in server logs
- [ ] Docker builds and runs successfully
- [ ] Documentation is clear and helpful
- [ ] Ready for development or deployment

## 🎉 Success!

If all items are checked, congratulations! Your Token Insight & Analytics API is ready to use.

## 📞 Need Help?

- Check the README.md for detailed documentation
- Review QUICKSTART.md for step-by-step instructions
- Look at PROJECT_OVERVIEW.md for architecture details
- Open an issue on GitHub
- Check server logs for error messages

---

**Happy Coding! 🚀**

