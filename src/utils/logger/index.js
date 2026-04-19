const winston = require('winston');

const isProduction = process.env.NODE_ENV === 'production';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message} ${
      info.stack ? `\nStack: ${info.stack}` : ''
    }`;
  })
);

// Build transports list dynamically based on environment
const transports = [
  // Console transport: always active (required for Render/cloud platforms)
  new winston.transports.Console({
    format: winston.format.combine(
      // Colorize only in dev (not useful in cloud logs)
      ...(isProduction ? [] : [winston.format.colorize()]),
      logFormat
    )
  }),
];

// File transports: only in local development (Render filesystem is ephemeral)
if (!isProduction) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: logFormat,
  transports,
});

module.exports = logger;

