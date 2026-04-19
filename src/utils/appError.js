/**
 * Centralized Application Error Handler
 * Every known operational error in the app should create an instance of this class.
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    // status gives us a clean consistent fail/error flag.
    // E.g., 400s -> 'fail', 500s -> 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Critical flag: Distinguishes between trusted logical errors (user provided bad email)
    // vs untrusted unhandled programming errors (a module crashed).
    this.isOperational = isOperational;

    // Capture the stack trace securely, removing this constructor's execution from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
