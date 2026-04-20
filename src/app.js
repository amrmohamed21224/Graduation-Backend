const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');
const schedulerJobs = require('./modules/scheduler/jobs');
const ApiResponse = require('./utils/apiResponse');
const httpLogger = require('./middlewares/logger.middleware');
const setupSwagger = require('./config/swagger');

const path = require('path');

const app = express();

// Serve static uploaded files locally
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize CRON Jobs safely on application boot
schedulerJobs.initJobs();

// 0. HTTP Request Logger
app.use(httpLogger);

// Setup Swagger API Documentation internally
setupSwagger(app);

// Security middlewares
// 1. Set security HTTP headers
app.use(helmet());

// 2. Enable CORS (Cross-Origin Resource Sharing)
// Restrict to known frontend origins — open cors() is a security risk in production
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://graduation-backend-production-b53d.up.railway.app', // Swagger UI and self-ref origin
  process.env.FRONTEND_URL, // Set this in production to your deployed frontend URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// 3. Limit requests from same IP (Brute-force/DDoS protection)
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window`
  windowMs: 15 * 60 * 1000, // 15 minutes
  handler: (req, res) => {
    return ApiResponse.error(res, 429, 'Too many requests from this IP, please try again in 15 minutes!');
  }
});
// Apply the rate limiter to all /api routes
app.use('/api', limiter);

// Body parser, reading data from body into req.body (Limit to 10kb to prevent payload overflow)
app.use(express.json({ limit: '10kb' }));

// 4. Data sanitization against NoSQL query injection
// Removes '$' and '.' characters from inputs preventing MongoDB operator injections
app.use(mongoSanitize());

// 5. Data sanitization against XSS (Cross-Site Scripting)
// Automatically converts malicious HTML/JS payloads embedded in body/query/params to safe mock strings
app.use(xss());

// API Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
