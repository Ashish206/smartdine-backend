const crypto = require('crypto');

/**
 * Collection of helper functions for common operations
 */
class Helpers {
  /**
   * Generate a random string of specified length
   * @param {number} length - Length of string to generate
   * @returns {string} Random string
   */
  static generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a random number between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array, empty object)
   * @param {*} value - Value to check
   * @returns {boolean}
   */
  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.deepClone(item));

    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }

  /**
   * Remove sensitive data from object
   * @param {Object} obj - Object to sanitize
   * @param {string[]} fields - Fields to remove
   * @returns {Object} Sanitized object
   */
  static sanitizeObject(obj, fields = ['password', 'token']) {
    const sanitized = this.deepClone(obj);
    fields.forEach((field) => {
      if (sanitized[field]) delete sanitized[field];
    });
    return sanitized;
  }

  /**
   * Format date to ISO string with timezone
   * @param {Date} date - Date to format
   * @returns {string} Formatted date
   */
  static formatDate(date = new Date()) {
    return date.toISOString();
  }

  /**
   * Check if string is valid JSON
   * @param {string} str - String to check
   * @returns {boolean}
   */
  static isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Convert object keys to camelCase recursively
   * @param {Object} obj - Object to convert
   * @returns {Object} Converted object
   */
  static toCamelCase(obj) {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.toCamelCase(v));
    }
    if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [this.toCamelCaseStr(key)]: this.toCamelCase(obj[key]),
        }),
        {}
      );
    }
    return obj;
  }

  /**
   * Convert string to camelCase
   * @param {string} str - String to convert
   * @returns {string} Converted string
   */
  static toCamelCaseStr(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  /**
   * Parse query string parameters
   * @param {Object} query - Query object
   * @returns {Object} Parsed query parameters
   */
  static parseQueryParams(query) {
    const parsed = {};

    for (const [key, value] of Object.entries(query)) {
      // Convert string numbers to actual numbers
      if (/^\d+$/.test(value)) {
        parsed[key] = parseInt(value, 10);
      }
      // Convert string booleans to actual booleans
      else if (value === 'true' || value === 'false') {
        parsed[key] = value === 'true';
      }
      // Convert comma-separated strings to arrays
      else if (typeof value === 'string' && value.includes(',')) {
        parsed[key] = value.split(',').map((v) => v.trim());
      }
      // Keep other values as is
      else {
        parsed[key] = value;
      }
    }

    return parsed;
  }

  /**
   * Calculate pagination metadata
   * @param {number} total - Total number of items
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Object} Pagination metadata
   */
  static getPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    };
  }
}

module.exports = Helpers;
