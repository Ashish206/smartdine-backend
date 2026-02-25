const https = require('https');
const http = require('http');
const logger = require('../config/logger');

/**
 * HTTP request utility with retries and timeouts
 */
class RequestUtil {
  /**
   * Make HTTP/HTTPS request
   * @param {Object} options - Request options
   * @param {string} options.url - Request URL
   * @param {string} options.method - HTTP method
   * @param {Object} options.headers - Request headers
   * @param {Object} options.body - Request body
   * @param {number} options.timeout - Request timeout in ms
   * @param {number} options.retries - Number of retries
   * @param {number} options.retryDelay - Delay between retries in ms
   * @returns {Promise} Response data
   */
  static async request({
    url,
    method = 'GET',
    headers = {},
    body = null,
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
  }) {
    const makeRequest = async (attempt) => {
      try {
        const response = await this._makeRequest({ url, method, headers, body, timeout });
        return response;
      } catch (error) {
        if (attempt < retries) {
          logger.warn(`Request failed, retrying (${attempt + 1}/${retries})...`, {
            url,
            error: error.message,
          });

          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return makeRequest(attempt + 1);
        }

        throw error;
      }
    };

    return makeRequest(0);
  }

  /**
   * Internal method to make a single request
   * @private
   */
  static _makeRequest({ url, method, headers, body, timeout }) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout,
      };

      const req = protocol.request(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = {
              statusCode: res?.statusCode || 500,
              headers: res.headers,
              data: data ? JSON.parse(data) : null,
            };

            // Log response for debugging
            logger.debug('API Response:', {
              url,
              method,
              statusCode: response?.statusCode || 500,
              responseSize: data.length,
            });

            if (res.statusCode >= 400) {
              reject(new Error(`HTTP Error: ${res.statusCode}`));
            } else {
              resolve(response);
            }
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${error.message}`));
          }
        });
      });

      // Handle request errors
      req.on('error', (error) => {
        logger.error('Request Error:', {
          url,
          method,
          error: error.message,
        });
        reject(error);
      });

      // Handle timeout
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeout}ms`));
      });

      // Send request body if present
      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * GET request helper
   * @param {string} url - Request URL
   * @param {Object} options - Additional options
   */
  static get(url, options = {}) {
    return this.request({ url, method: 'GET', ...options });
  }

  /**
   * POST request helper
   * @param {string} url - Request URL
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   */
  static post(url, body, options = {}) {
    return this.request({ url, method: 'POST', body, ...options });
  }

  /**
   * PUT request helper
   * @param {string} url - Request URL
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   */
  static put(url, body, options = {}) {
    return this.request({ url, method: 'PUT', body, ...options });
  }

  /**
   * DELETE request helper
   * @param {string} url - Request URL
   * @param {Object} options - Additional options
   */
  static delete(url, options = {}) {
    return this.request({ url, method: 'DELETE', ...options });
  }
}

module.exports = RequestUtil;
