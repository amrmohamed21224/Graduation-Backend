const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

// Mongoose generic cast errors (e.g., querying by ID with an invalid character string)
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Mongoose uniquely indexed duplicate value errors
const handleDuplicateFieldsDB = err => {
  const valueMatch = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/) : null;
  const value = valueMatch ? valueMatch[0] : 'a field';
  const message = `Duplicate value encountered: ${value}. Please use a different value.`;
  return new AppError(message, 400);
};

// Mongoose schema validation errors
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Validation Field Error: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// JWT specific failures
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// Standardized payload format for local development
const sendErrorDev = (err, res) => {
  logger.error(err.message, { stack: err.stack });
  
  ApiResponse.error(res, err.statusCode, err.message, {
    error: err,
    stack: err.stack
  });
};

// Standardized secure payload format for actual end users
const sendErrorProd = (err, res) => {
  // A. Operational, trusted error -> Perfectly safe to send the explicit message down
  if (err.isOperational) {
    ApiResponse.error(res, err.statusCode, err.message);
  } 
  // B. Programming or unknown logic error -> DO NOT leak the internal details!
  else {
    // 1) Log to remote monitoring systems or explicit internal files
    logger.error('CRITICAL UNHANDLED EXCEPTION 💥', { 
      message: err.message, 
      stack: err.stack, 
      originalError: err 
    });

    // 2) Send generic highly sanitized message to the user
    ApiResponse.error(res, 500, 'Internal Server Error. Please contact support.');
  }
};

/**
 * EXPORTED: Global Error Handling Middleware
 */
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone error so we don't unexpectedly mutate the original reference
    let error = Object.assign({}, err);
    error.name = err.name;
    error.message = err.message;

    // Execute standard known database intercepts
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
