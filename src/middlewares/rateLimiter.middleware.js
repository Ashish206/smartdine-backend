const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');
const ResponseHandler = require('../utils/responseHandler');

// Preset configurations for different rate limiting scenarios
const PRESET_CONFIGS = {
  SENSITIVE: {
    windowMs: 30 * 1000, // 30 seconds
    max: 2,
    message: 'Please wait 30 seconds before making another request.',
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: 'Too many requests, please try again later.',
  },
  STRICT: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
    message: 'Access limited. Please try again later.',
  },
  MODERATE: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    message: 'Too many attempts. Please wait.',
  },
};

/**
 * Creates a rate limiter middleware with the given configuration
 * @param {Object} config Rate limiter configuration
 * @param {number} config.windowMs Time window in milliseconds
 * @param {number} config.max Maximum number of requests in the time window
 * @param {string} config.message Error message when limit is exceeded
 * @param {string} config.prefix Redis key prefix
 * @returns {Function} Express middleware
 */
function createLimiter(config = {}) {

  return rateLimit({
    ...config,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        userId: req.user?.id,
        path: req.path,
        type: config.prefix,
      });

      ResponseHandler.error(res, 200, config.message || 'Too many requests.');
    },
    skip: (req) => req.path === '/health',
  });
}

/**
 * Rate limiter factory with preset configurations
 */
const rateLimiter = {
  // Create limiter with custom config
  create: (config) => createLimiter(config),

  // Preset limiters
  sensitive: () => createLimiter({ ...PRESET_CONFIGS.SENSITIVE, prefix: 'sensitive' }),
  api: () => createLimiter({ ...PRESET_CONFIGS.API, prefix: 'api' }),
  strict: () => createLimiter({ ...PRESET_CONFIGS.STRICT, prefix: 'strict' }),
  moderate: () => createLimiter({ ...PRESET_CONFIGS.MODERATE, prefix: 'moderate' }),

  // Helper to apply multiple rate limits
  combine: (...limiters) => {
    return (req, res, next) => {
      const runLimiter = (index) => {
        if (index >= limiters.length) {
          return next();
        }
        limiters[index](req, res, () => runLimiter(index + 1));
      };
      runLimiter(0);
    };
  },
};

module.exports = rateLimiter;
