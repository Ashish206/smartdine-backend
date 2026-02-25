const logger = require('../config/logger');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  logger.error(`Cannot find ${req.originalUrl} on this server`);
  next(new APIError(404, `Cannot find ${req.originalUrl} on this server`));
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });

  // Handle specific types of errors
  let error = { ...err };
  error.message = err?.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new APIError(409, `Duplicate field value: ${field}. Please use another value`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    error = new APIError(400, 'Invalid input data', errors);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new APIError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new APIError(401, 'Invalid token. Please log in again');
  }

  if (err.name === 'TokenExpiredError') {
    error = new APIError(401, 'Your token has expired. Please log in again');
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    error = new APIError(400, err.message);
  }

  // Handle programming errors only in development
  if (process.env.NODE_ENV === 'development') {
    return ResponseHandler.error(res, error?.statusCode, error.message, {
      status: error.status,
      error: err,
      stack: err.stack,
      body: req.body,
    });
  }
  logger.error(
    `Unexpected error[84]: ${JSON.stringify({
      status: error.status,
      error: err,
      stack: err.stack,
      body: req.body,
    })} `
  );
  return ResponseHandler.error(res, error.statusCode);
};

/**
 * Async handler wrapper to eliminate try-catch blocks
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  APIError,
  notFoundHandler,
  errorHandler,
  asyncHandler,
};
