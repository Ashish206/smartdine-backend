const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

class JWTUtil {
  /**
   * Generate JWT token
   * @param {object} payload - Data to be encoded in the token
   * @param {string} expiresIn - Token expiration time
   * @returns {string} JWT token
   */

  static generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
    try {
      return jwt.sign(payload, process.env.PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn,
      });
    } catch (error) {
      logger.error('JWT Generation Error:', error);
      throw new Error('Error generating token');
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {object} Decoded token payload
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.PUBLIC_KEY);
    } catch (error) {
      logger.error('JWT Verification Error:', error);
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate refresh token
   * @param {object} payload - Data to be encoded in the token
   * @returns {string} Refresh token
   */
  static generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, process.env.PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '4d', // 4 days
      });
    } catch (error) {
      logger.error('Refresh Token Generation Error:', error);
      throw new Error('Error generating refresh token');
    }
  }

  /**
   * Extract token from request headers
   * @param {object} req - Express request object
   * @returns {string|null} JWT token or null
   */
  static extractTokenFromHeaders(req) {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader) {
        return null;
      }

      // Check for Bearer token
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        return authHeader.split(' ')[1];
      }

      // If it's just the token without Bearer prefix
      if (!authHeader.includes(' ')) {
        return authHeader;
      }

      return null;
    } catch (error) {
      logger.error('Token Extraction Error:', error);
      return null;
    }
  }

  /**
   * Set JWT token in cookie
   * @param {object} res - Express response object
   * @param {string} token - JWT token
   * @param {string} name - Cookie name
   */
  static setTokenCookie(res, token, name = 'jwt') {
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie(name, token, cookieOptions);
  }

  /**
   * Clear JWT token cookie
   * @param {object} res - Express response object
   * @param {string} name - Cookie name
   */
  static clearTokenCookie(res, name = 'jwt') {
    res.cookie(name, 'logged_out', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    });
  }
}

module.exports = JWTUtil;
