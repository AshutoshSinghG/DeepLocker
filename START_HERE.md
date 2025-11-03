# 🎯 START HERE - Token Insight & Analytics API

Welcome! This is your complete, production-ready MEN stack backend API for cryptocurrency token insights and wallet analytics.

## 📚 Quick Navigation

**Choose your path:**

### 🚀 I Want to Run It Now (5 minutes)
👉 Read: **[QUICKSTART.md](./QUICKSTART.md)**

### 📖 I Want to Understand the Project
👉 Read: **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**

### 🔧 I Want Full Documentation
👉 Read: **[README.md](./README.md)**

### ✅ I Want to Verify Setup
👉 Read: **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**

### 🐳 I Want Docker Deployment
👉 Read: **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

## 🎯 What This Project Does

### 1️⃣ Token Insight API
Get AI-powered insights for any cryptocurrency:
```
POST /api/token/bitcoin/insight
→ Returns: Market data + AI sentiment analysis
```

### 2️⃣ Wallet PnL API
Track profit & loss for HyperLiquid wallets:
```
GET /api/hyperliquid/0xabc.../pnl?start=2025-01-01&end=2025-01-07
→ Returns: Daily PnL breakdown + summary stats
```

## ⚡ Lightning Fast Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Add your HuggingFace or OpenAI API key

# 3. Run
npm run dev

# 4. Test
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd"}'
```

🎉 **That's it!** Your API is running.

## 📦 What's Included

✅ Complete MEN stack backend  
✅ AI integration (HuggingFace & OpenAI)  
✅ CoinGecko API integration  
✅ HyperLiquid PnL tracking  
✅ Docker & docker-compose  
✅ Comprehensive documentation  
✅ Postman collection  
✅ Error handling  
✅ Security (Helmet, CORS)  
✅ In-memory caching  
✅ Health checks  
✅ Production-ready  

## 📁 Project Structure

```
token-insight-backend/
├── src/                           # Source code
│   ├── config/                    # Configuration
│   ├── controllers/               # Request handlers
│   ├── routes/                    # API endpoints
│   ├── services/                  # External API integrations
│   ├── utils/                     # Helper functions
│   ├── app.js                     # Express app
│   └── server.js                  # Entry point
├── .env.example                   # Environment template
├── Dockerfile                     # Docker build
├── docker-compose.yml             # Docker orchestration
├── package.json                   # Dependencies
├── README.md                      # Full documentation
├── QUICKSTART.md                  # Quick guide
├── SETUP_CHECKLIST.md             # Verification checklist
├── DEPLOYMENT_GUIDE.md            # Production guide
├── PROJECT_OVERVIEW.md            # Architecture overview
└── postman_collection.json        # API testing
```

## 🔑 Required Setup

**Minimum Required:**
- ✅ Node.js 18+
- ✅ One AI API key (HuggingFace OR OpenAI)

**Optional but Recommended:**
- CoinGecko API key (better rate limits)
- MongoDB (for caching/logs)
- Docker (for containerization)

**Get Free API Keys:**
- 🆓 [HuggingFace](https://huggingface.co/settings/tokens) - Free tier available
- 🔑 [OpenAI](https://platform.openai.com/api-keys) - Paid but free credits
- 🪙 [CoinGecko](https://www.coingecko.com/en/api) - Free tier available

## 🧪 Test Examples

```bash
# Health check
curl http://localhost:5000/health

# Bitcoin insight
curl -X POST http://localhost:5000/api/token/bitcoin/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd"}'

# Ethereum insight
curl -X POST http://localhost:5000/api/token/ethereum/insight \
  -H "Content-Type: application/json" \
  -d '{"vs_currency": "usd", "history_days": 30}'

# Wallet PnL
curl "http://localhost:5000/api/hyperliquid/0xabc/pnl?start=2025-01-01&end=2025-01-07"

# Wallet summary
curl http://localhost:5000/api/hyperliquid/0xabc/summary
```

## 🐛 Common Issues

**"Cannot find module"**
→ Run: `npm install`

**"Port 5000 in use"**
→ Edit `.env` and change `PORT=5000` to `PORT=5001`

**"AI service not working"**
→ Check your API key in `.env` and ensure `AI_PROVIDER` is set

**"MongoDB connection failed"**
→ MongoDB is optional! Remove `MONGODB_URI` from `.env` if not using it

## 📞 Need Help?

1. Check **[QUICKSTART.md](./QUICKSTART.md)** for step-by-step setup
2. Read **[README.md](./README.md)** for detailed docs
3. Review **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** to verify setup
4. See server logs for error messages

## 🎓 What You'll Learn

✅ RESTful API design  
✅ MEN stack architecture  
✅ External API integration  
✅ AI model integration  
✅ Docker containerization  
✅ Error handling patterns  
✅ Security best practices  
✅ Production deployment  

## 🚀 Deployment Options

- **Local Development**: `npm run dev`
- **Production PM2**: `pm2 start src/server.js`
- **Docker**: `docker-compose up -d`
- **Kubernetes**: See DEPLOYMENT_GUIDE.md

## 📊 Features

✨ AI-powered sentiment analysis  
📈 Real-time market data  
💰 Comprehensive PnL tracking  
🔒 Production-ready security  
⚡ Smart caching  
📝 Full documentation  
🐳 Docker support  
🧪 Testing tools  
📱 Postman collection  

## 🎯 Next Steps

1. ✅ Read QUICKSTART.md to get started
2. ✅ Run `npm install && npm run dev`
3. ✅ Test with curl or Postman
4. ✅ Read PROJECT_OVERVIEW.md to understand architecture
5. ✅ Deploy to production using DEPLOYMENT_GUIDE.md

---

## 📝 Project Status

✅ **Complete & Production-Ready**

All features implemented:
- Token Insight API with AI
- HyperLiquid PnL API
- Docker containerization
- Comprehensive documentation
- Error handling
- Security features
- Testing support

**Ready to deploy!** 🚀

---

**Built with ❤️ using MEN Stack**  
**Node.js + Express + MongoDB**

Have questions? Check the documentation or open an issue!

Happy coding! 🎉

