/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * User Roles
 */
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

/**
 * Cache TTL (Time To Live) in seconds
 */
const CACHE_TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
};

/**
 * API Rate Limits
 */
const RATE_LIMITS = {
  DEFAULT: {
    WINDOW_MS: 900000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  STRICT: {
    WINDOW_MS: 3600000, // 1 hour
    MAX_REQUESTS: 5,
  },
};

/**
 * JWT Constants
 */
const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '1d',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  COOKIE_EXPIRES_IN: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  COOKIE_NAME: 'jwt',
};

/**
 * Validation Constants
 */
const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 30,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

/**
 * Pagination Constants
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc',
  },
};

/**
 * Response Messages
 */
const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again',
    TOKEN_INVALID: 'Invalid authentication token',
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
  },
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists with this email',
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
  },
  GENERIC: {
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
  },
};

/**
 * Environment Types
 */
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

/**
 * Security Constants
 */
const SECURITY = {
  BCRYPT_SALT_ROUNDS: 12,
  CORS_MAX_AGE: 24 * 60 * 60, // 24 hours in seconds
  SECURE_HEADERS: {
    CONTENT_SECURITY_POLICY:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
  },
};

module.exports = {
  HTTP_STATUS,
  ROLES,
  CACHE_TTL,
  RATE_LIMITS,
  JWT,
  VALIDATION,
  PAGINATION,
  MESSAGES,
  ENV,
  SECURITY,
};
