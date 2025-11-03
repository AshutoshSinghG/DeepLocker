const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start the Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB (optional - will continue even if fails)
    await connectDB();

    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('Token Insight & Analytics API Server Running');
      console.log('='.repeat(60));
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log(`Token Insight: POST http://localhost:${PORT}/api/token/:id/insight`);
      console.log(`Wallet PnL: GET http://localhost:${PORT}/api/hyperliquid/:wallet/pnl`);
      console.log('='.repeat(60) + '\n');
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error(' Forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

