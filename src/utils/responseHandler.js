const logger = require('../config/logger');

/**
 * Standard response structure for API endpoints
 */
class ResponseHandler {
  /**
   * Send success response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {object} data - Response data
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      success: true,
      message,
      data,
    };

    // Log the response
    logger.info(`API Response [${statusCode}]`);

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {object} errors - Detailed error information
   */
  static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
    const response = {
      success: false,
      message,
      errors,
    };

    // Log the error
    logger.error(`API Error [${statusCode}]: ${message}`, errors);

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   * @param {object} res - Express response object
   * @param {object} errors - Validation errors
   */
  static validationError(res, errors) {
    return this.error(res, 400, 'Validation Error', errors);
  }

  /**
   * Send unauthorized error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, 401, message);
  }

  /**
   * Send forbidden error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = 'Forbidden access') {
    return this.error(res, 403, message);
  }

  /**
   * Send not found error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Send conflict error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = 'Resource conflict') {
    return this.error(res, 409, message);
  }
}

module.exports = ResponseHandler;
