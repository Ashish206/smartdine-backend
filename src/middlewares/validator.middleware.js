const Joi = require('joi');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');

/**
 * Request validation middleware factory
 * @param {object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 * @returns {Function} Validation middleware
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Ignore unknown props
      stripUnknown: true, // Remove unknown props
    };
    // Handle nested schema structure
    if (!schema[property]) {
      logger.warn(`Validation schema for ${property} not found`);
      return next();
    }

    const { error, value } = schema[property].validate(req[property], options);

    if (error) {
      const validationErrors = {};
      const errorMessages = [];

      error.details.forEach((err) => {
        const field = err.context.key;
        const message = err.message.replace(/['"]/g, '');
        validationErrors[field] = message;
        errorMessages.push(message);
      });

      logger.warn('Validation Error:', {
        path: req.path,
        errors: validationErrors,
      });

      return ResponseHandler.error(res, 400, errorMessages.join('. '), validationErrors);
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User registration schema
  registration: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .trim()
      .lowercase()
      .message('Please provide a valid email address'),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .message(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
      ),
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .message('Name must be between 2 and 50 characters'),
    role: Joi.string().valid('user', 'admin').default('user'),
  }),

  // Login schema
  login: Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required(),
  }),

  // ID parameter schema
  idParam: Joi.object({
    id: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .message('Invalid ID format'),
  }),

  // Pagination schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // Custom schema generator
  custom: (schema) => schema,
};

// Export validateRequest as default for convenience, and schemas as named export
module.exports = validateRequest;
module.exports.schemas = schemas;
