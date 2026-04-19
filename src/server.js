require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// ============================================================
// ENV VALIDATION — Fail fast if critical variables are missing
// ============================================================
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`❌ FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

const logger = require('./utils/logger');

// Catch Uncaught Exceptions immediately to prevent corrupted state
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
    error: err.name,
    message: err.message,
    stack: err.stack
  });
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Subscribing to Unhandled Promise Rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
    error: err.name,
    message: err.message,
    stack: err.stack
  });
  
  // Gracefully close server before killing process
  server.close(() => {
    process.exit(1);
  });
});
};

startServer();
