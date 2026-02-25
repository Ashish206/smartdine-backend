const JWTUtil = require('../utils/jwt');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');

/**
 * Middleware to verify JWT token and authenticate requests
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from authorization header or cookies
    const token = JWTUtil.extractTokenFromHeaders(req);
    if (!token) {
      logger.error('Jwt Authentication Error: token was not provided');
      return ResponseHandler.unauthorized(res, 'Authentication token is required.');
    }

    // Verify token
    const decoded = JWTUtil.verifyToken(token);

    // Attach user data to request object
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Jwt Authentication Error:', error);
    return ResponseHandler.unauthorized(res, error.message);
  }
};

/**
 * Middleware to check user roles and permissions
 * @param {string[]} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return ResponseHandler.unauthorized(res, 'User not authenticated.');
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return ResponseHandler.forbidden(res, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      logger.error('Authorization Error:', error);
      return ResponseHandler.error(res, 500, 'Authorization failed');
    }
  };
};

/**
 * Middleware to refresh JWT token if it's about to expire
 */
const refreshToken = (req, res, next) => {
  try {
    const token = JWTUtil.extractTokenFromHeaders(req) || req.cookies.jwt;

    if (token) {
      const decoded = JWTUtil.verifyToken(token);

      // Check if token is close to expiring (less than 15 minutes)
      const tokenExp = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExp = tokenExp - now;

      if (timeUntilExp < 15 * 60 * 1000) {
        // Generate new token
        const newToken = JWTUtil.generateToken({
          id: decoded.id,
          role: decoded.role,
        });

        // Set new token in cookie
        JWTUtil.setTokenCookie(res, newToken);

        // Set new token in response header
        res.setHeader('X-New-Token', newToken);
      }
    }

    next();
  } catch (error) {
    logger.error('Token Refresh Error:', error);
    next();
  }
};

/**
 * Middleware that combines authentication with uid validation
 * First authenticates the request, then validates that req.user.uid exists
 */
const authenticateWithUidValidation = async (req, res, next) => {
  try {
    // First run the authenticate middleware
    await new Promise((resolve, reject) => {
      authenticate(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // After authentication, validate that req.user.uid exists
    if (!req.user || !req.user.uid) {
      logger.error('Authentication Error: req.user.uid is missing');
      return ResponseHandler.unauthorized(res, 'User ID is required for this operation.');
    }

    logger.info('Authentication and UID validation successful');
    next();
  } catch (error) {
    logger.error('Authentication with UID validation Error:', error);
    return ResponseHandler.unauthorized(res, error.message || 'Authentication failed');
  }
};

// Export authenticateWithUidValidation as default for convenience
const auth = authenticateWithUidValidation;

const apiKeyValidation = (req, res, next) => {
  const ssrRequest = req.headers['x-ssr-request'];
  const apiKey = req.headers['x-api-key'];
  if (!ssrRequest || !apiKey || apiKey !== process.env.API_KEY) {
    logger.error(`api key validation failed: ${ssrRequest} : ${apiKey?.length}`);
    return ResponseHandler.unauthorized(res);
  }
  next();
};

module.exports = auth;
module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
module.exports.refreshToken = refreshToken;
module.exports.apiKeyValidation = apiKeyValidation;
