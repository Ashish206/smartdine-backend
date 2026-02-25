const winston = require('winston');
const path = require('path');
require('dotenv').config();
const { LoggingWinston } = require('@google-cloud/logging-winston');
const { RequestContext } = require('../utils/requestContext');

const loggingWinston = new LoggingWinston();

// Add request ID to log metadata
const addRequestId = winston.format((info) => {
  const requestId = RequestContext.getRequestId();
  return requestId ? { ...info, requestId } : info;
});

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  addRequestId(),
  winston.format.json()
);

// Define console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  addRequestId(),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} ${level}: [${requestId || 'NO_REQ_ID'}] ${message} ${metaString}`;
  })
);

const devConfig = [
  // Write logs to console
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // Write logs to file
  new winston.transports.File({
    filename: path.join(process.env.LOG_FILE_PATH || 'logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(process.env.LOG_FILE_PATH || 'logs/combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

const prodConfig = [
  new winston.transports.Console(),
  // Add Cloud Logging
  loggingWinston,
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: process.env.NODE_ENV === 'development' ? devConfig : prodConfig,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs/exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs/rejections.log'),
    }),
  ],
});

module.exports = logger;
