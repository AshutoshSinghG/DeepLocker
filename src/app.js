const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const tokenRoutes = require('./routes/tokenRoutes');
const pnlRoutes = require('./routes/pnlRoutes');

// Import error handler
const { errorHandler } = require('./utils/errorHandler');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/token', tokenRoutes);
app.use('/api/hyperliquid', pnlRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Token Insight & Analytics API',
    version: '1.0.0',
    endpoints: {
      token_insight: 'POST /api/token/:id/insight',
      wallet_pnl: 'GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD',
      wallet_summary: 'GET /api/hyperliquid/:wallet/summary',
      health: 'GET /health',
    },
    documentation: 'See README.md for full API documentation',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

