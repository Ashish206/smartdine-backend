const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const authValidation = require('../validations/auth.validation');
const auth = require('../middlewares/auth.middleware');
const rateLimiter = require('../middlewares/rateLimiter.middleware');

// Initialize rate limiters
const { sensitive: sensitiveLimit, moderate: moderateLimit } = rateLimiter;

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post(
  '/register',
  sensitiveLimit(),
  validate(authValidation.register),
  authController.register
);

router.post('/login', moderateLimit(), validate(authValidation.login), authController.login);

router.post(
  '/google',
  moderateLimit(),
  validate(authValidation.googleSignIn),
  authController.googleSignIn
);

// Sensitive endpoints with strict rate limiting
router.post(
  '/forgot-password',
  sensitiveLimit(),
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  sensitiveLimit(),
  validate(authValidation.resetPassword),
  authController.resetPassword
);

// Email verification endpoints
router.post(
  '/verify-email',
  moderateLimit(),
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

router.get('/get-user', auth, authController.getUser);

router.post(
  '/resend-verification',
  sensitiveLimit(),
  validate(authValidation.resendEmailVerification),
  authController.resendEmailVerification
);

// Refresh token endpoint
router.post(
  '/refresh-token',
  sensitiveLimit(),
  validate(authValidation.refreshToken),
  authController.refreshAccessToken
);

module.exports = router;
