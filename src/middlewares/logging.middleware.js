const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');
const { RequestContext } = require('../utils/requestContext');

/**
 * Generate a unique request ID
 */
const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  logger.info(`New incomming request: ${id}`);
  RequestContext.run(id, () => {
    next();
  });
};

/**
 * Custom morgan token for request correlation ID
 */
morgan.token('id', (req) => req.id);

/**
 * Custom morgan token for request body
 */
morgan.token('body', (req) => {
  const body = { ...req.body };

  // Remove sensitive information
  if (body.password) body.password = '[REDACTED]';
  if (body.token) body.token = '[REDACTED]';
  if (body.creditCard) body.creditCard = '[REDACTED]';

  return JSON.stringify(body);
});

/**
 * Custom morgan token for response body
 */
morgan.token('response-body', (req, res) => {
  if (res._body) {
    const body = { ...res._body };

    // Remove sensitive information
    if (body.token) body.token = '[REDACTED]';
    if (body.password) body.password = '[REDACTED]';

    return JSON.stringify(body);
  }
  return '';
});

/**
 * Store original response send
 */
const responseBodyCapture = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res._body = body;
    return originalSend.call(this, body);
  };

  next();
};

/**
 * Custom morgan format
 */
const morganFormat =
  ':id [:date[iso]] ":method :url" :status :response-time ms - :res[content-length] bytes ":referrer" ":user-agent"';

/**
 * Create morgan middleware with custom format
 */
const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      // Remove line breaks and extra spaces
      const cleanMessage = message.replace(/\n/g, '').trim();
      logger.http(cleanMessage);
    },
  },
  skip: (req) => {
    // Skip logging for health check endpoints
    return req.url === '/health' || req.url === '/health/';
  },
});

/**
 * Error logging middleware
 */
const errorLogger = (err, req, res, next) => {
  logger.error('Unexpected error[95]:', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    params: req.params,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    userId: req.user?.id,
  });

  next(err);
};

/**
 * Performance monitoring middleware
 */
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    if (duration > 1000) {
      // Log slow requests (>1s)
      logger.warn('Slow Request:', {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration.toFixed(2)}ms`,
      });
    }
  });

  next();
};

module.exports = {
  requestId,
  responseBodyCapture,
  httpLogger,
  errorLogger,
  performanceMonitor,
};
