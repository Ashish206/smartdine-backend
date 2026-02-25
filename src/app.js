const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { SECURITY } = require('./constants');
const {
  requestId,
  responseBodyCapture,
  httpLogger,
  errorLogger,
  performanceMonitor,
} = require('./middlewares/logging.middleware');
const rateLimiters = require('./middlewares/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const JWTUtil = require('./utils/jwt');
const logger = require('./config/logger');
const { apiKeyValidation } = require('./middlewares/auth.middleware');

// Initialize express app
const app = express();

// Initialize Redis and setup middlewares
const initializeApp = async () => {
  try {
    // Request ID middleware
    app.use(requestId);

    // Body parser middleware
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(cookieParser());

    // Security middleware
    app.use(helmet()); // Set security HTTP headers
    app.use(mongoSanitize()); // Sanitize request data against NoSQL query injection
    app.use(compression()); // Compress response bodies
    // apiKey validation middleware
    app.use(apiKeyValidation);
    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
    const corsOptions = {
      origin:
        process.env.NODE_ENV === 'development'
          ? true
          : (origin, callback) => {
              if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                  'The CORS policy for this site does not allow access from the specified Origin.';
                logger.error(`CORS request from origin: ${origin}`);
                return callback(new Error(msg), false);
              }
              return callback(null, true);
            },
      credentials: true,
      maxAge: SECURITY.CORS_MAX_AGE,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Request-ID',
        'X-SSR-Request',
        'Origin',
        'X-Forwarded-For',
        'x-api-key',
      ],
      exposedHeaders: ['X-Request-ID', 'X-New-Token'],
    };
    app.use(cors(corsOptions));

    // Apply standard API rate limiting after Redis connection
    // app.use('/api', rateLimiters.api());

    // Logging middleware
    app.use(responseBodyCapture);
    app.use(httpLogger);
    app.use(performanceMonitor);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        redis: 'connected',
      });
    });

    if (process.env.NODE_ENV === 'development') {
      app.get('/api/v1/token/generateToken', async (req, res) => {
        try {
          const token = JWTUtil.generateToken({ uid: req.query.uid });
          res.status(200).json({ token });
        } catch (error) {
          res.status(500).json({ status: 'error', message: error.message });
        }
      });
    }
    // API routes will be registered here
    // eslint-disable-next-line global-require
    app.use(`/api/v1${process.env.API_ROUTE_KEY}`, require('./routes'));

    // Handle undefined routes
    app.use(notFoundHandler);

    // Error handling middleware
    app.use(errorLogger);
    app.use(errorHandler);

    return app;
  } catch (error) {
    logger.error(`Application initialization failed: `, error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    process.exit(0);
  } catch (error) {
    logger.error(`Error during graceful shutdown: `, error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: `, error);
  gracefulShutdown();
});

process.on('unhandledRejection', (error) => {
  logger.error(`Uncaught Rejection: `, error);
  gracefulShutdown();
});

// Export both the app and the initialization function
module.exports = { app, initializeApp };
