const { auth, db } = require('../config/firebase');
const JWTUtil = require('../utils/jwt');
const ResponseHandler = require('../utils/responseHandler');
const { asyncHandler, APIError } = require('../middlewares/error.middleware');
const { getFirebaseErrorMessage } = require('../constants/firebaseErrors');
const emailUtil = require('../utils/email');
const logger = require('../config/logger');

// Status code mapping for Firebase errors
const ERROR_STATUS_CODES = {
  'auth/email-already-exists': 409,
  'auth/invalid-email': 400,
  'auth/user-not-found': 404,
  'auth/wrong-password': 401,
  'auth/invalid-credential': 401,
  'auth/operation-not-allowed': 403,
  'auth/invalid-verification-code': 400,
  'auth/invalid-id-token': 401,
  default: 500,
};

const getErrorStatus = (error) => ERROR_STATUS_CODES[error.code] || ERROR_STATUS_CODES.default;

/**
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;
  logger.info(`[Registration]: registration started for ${email}`);
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    });

    logger.info(`[Registration]: user created ${email}`);
    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      fullName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    logger.info(`[Registration]: user stored in db ${email}`);

    // Send verification email using Firebase
    const url = await auth.generateEmailVerificationLink(email, {
      url: `${process.env.FRONTEND_URL}/verify-token?mode=action&oobCode=code`,
    });
    logger.info(`[Registration]: email verification url generated`);

    // Send welcome email asynchronously (fire and forget)
    emailUtil.sendWelcome(email, url);
    logger.info(`[Registration]: welcome email initiated for ${email}`);

    ResponseHandler.success(
      res,
      201,
      'Registration successful. Please check your email to verify your account.'
    );
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Registration][Error][${email}]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Login user with email and password
 */
const login = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info(`[Login]: login started for ${email}`);
  try {
    const userCredential = await auth.getUserByEmail(email);

    if (!userCredential.emailVerified) {
      logger.error(`[Login]: email not verified ${email}`);
      throw new APIError(403, 'Please verify your email before logging in.');
    }

    // Generate access and refresh tokens
    const accessToken = JWTUtil.generateToken({ uid: userCredential.uid });
    const refreshToken = JWTUtil.generateRefreshToken({ uid: userCredential.uid });

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userCredential.uid).get();

    if (!userDoc.exists) {
      logger.error(`[Login]: user does not exists ${email}`);
      ResponseHandler.error(res, 404, 'User profile not found');
    }
    logger.info(`[Login]: user exists ${email}`);

    const userData = userDoc.data();
    logger.info(`[Login]: user login successful ${email}`);

    ResponseHandler.success(res, 200, 'Login successful', {
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
        fullName: userData.fullName,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Login][Error]: user login failed ${email}: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Google Sign In
 */
const googleSignIn = asyncHandler(async (req, res) => {
  const { token } = req.body;
  logger.info(`[Google Login]: login started`);

  try {
    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;
    logger.info(`[Google Login]: user email: ${email}`);

    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // Create new user document if doesn't exist
      await db.collection('users').doc(uid).set({
        fullName: name,
        email,
        photoURL: picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info(`[Google Login]: user stored in db: ${email}`);
    }

    // Generate tokens
    const accessToken = JWTUtil.generateToken({ uid });
    const refreshToken = JWTUtil.generateRefreshToken({ uid });
    logger.info(`[Google Login]: user login successful: ${email}`);
    ResponseHandler.success(res, 200, 'Google sign in successful', {
      user: {
        uid,
        email,
        fullName: name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Google Login][Error]: user login failed: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info(`[Forgot Password]: password reset started for ${email}`);
  try {
    await auth.getUserByEmail(email);
    logger.info(`[Forgot Password]: user found in records:  ${email}`);
    // Send password reset email using Firebase
    const resetUrl = await auth.generatePasswordResetLink(email, {
      url: `${process.env.FRONTEND_URL}/verify-token`,
    });
    logger.info(`[Forgot Password]: password reset url generated for ${email}`);
    // Send password reset email asynchronously (fire and forget)
    emailUtil.sendPasswordReset(email, resetUrl);
    logger.info(`[Forgot Password]: reset email initiated for ${email}`);

    ResponseHandler.success(res, 200, 'Password reset link sent to your email');
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Forgot Password][Error][${email}]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { oobCode, newPassword } = req.body;
  logger.info(`[Reset Password]: password reset started`);

  try {
    // Check action code and get email
    const actionCodeInfo = await auth.checkActionCode(oobCode);

    if (actionCodeInfo.operation !== 'PASSWORD_RESET') {
      logger.error(`[Reset Password]: invalid action code for password reset`);
      throw new APIError(400, 'Invalid action code for password reset');
    }

    // Get user and apply password reset
    const {
      data: { email },
    } = actionCodeInfo;
    logger.info(`[Reset Password]: action code verified for ${email}`);

    await auth.confirmPasswordReset(oobCode, newPassword);
    logger.info(`[Reset Password]: password reset confirmed for ${email}`);

    // Get user for Firestore update
    const user = await auth.getUserByEmail(email);

    // Update password reset timestamp in Firestore
    await db.collection('users').doc(user.uid).update({
      passwordResetAt: new Date(),
    });
    logger.info(`[Reset Password]: password reset timestamp updated for ${email}`);

    ResponseHandler.success(res, 200, 'Password has been reset successfully');
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Reset Password][Error]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Verify Email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { oobCode } = req.body;
  logger.info(`[Verify Email]: email verification started`);

  try {
    // Check action code and get email
    const actionCodeInfo = await auth.checkActionCode(oobCode);

    if (actionCodeInfo.operation !== 'VERIFY_EMAIL') {
      logger.error(`[Verify Email]: invalid action code for email verification`);
      throw new APIError(400, 'Invalid action code for email verification');
    }

    // Apply email verification
    await auth.applyActionCode(oobCode);

    // Get user for Firestore update
    const {
      data: { email },
    } = actionCodeInfo;
    logger.info(`[Verify Email]: action code verified for ${email}`);

    const user = await auth.getUserByEmail(email);

    // Update email verified timestamp in Firestore
    await db.collection('users').doc(user.uid).update({
      emailVerifiedAt: new Date(),
    });
    logger.info(`[Verify Email]: email verification completed for ${email}`);

    ResponseHandler.success(res, 200, 'Email verified successfully');
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Verify Email][Error]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Get User
 */
const getUser = asyncHandler(async (req, res) => {
  const { uid } = req?.user || {};
  logger.info(`[Get User]: get user started for uid: ${uid}`);

  try {
    if (!uid) {
      logger.error(`[Get User]: unauthorized access attempt`);
      return ResponseHandler.error(res, 401, 'Unauthorized');
    }

    const userCredential = await auth.getUser(uid);
    logger.info(`[Get User]: user found for ${userCredential.email}`);

    if (!userCredential.emailVerified) {
      logger.error(`[Get User]: email not verified for ${userCredential.email}`);
      throw new APIError(403, 'Please verify your email before logging in.');
    }

    // Generate access token
    const accessToken = JWTUtil.generateToken({ uid: userCredential.uid });

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userCredential.uid).get();

    if (!userDoc.exists) {
      logger.error(`[Get User]: user profile not found for ${userCredential.email}`);
      throw new APIError(404, 'User profile not found');
    }

    const userData = userDoc.data();
    logger.info(`[Get User]: user data retrieved successfully for ${userCredential.email}`);

    ResponseHandler.success(res, 200, 'User retrieved successfully', {
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
        fullName: userData.fullName,
      },
      accessToken,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Get User][Error]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Resend Email Verification
 */
const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info(`[Resend Email Verification]: resend verification started for ${email}`);

  try {
    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    logger.info(`[Resend Email Verification]: user found for ${email}`);

    if (userRecord.emailVerified) {
      logger.error(`[Resend Email Verification]: email already verified for ${email}`);
      throw new APIError(400, 'Email is already verified');
    }

    // Generate and send verification email
    const url = await auth.generateEmailVerificationLink(email, {
      url: `${process.env.FRONTEND_URL}/verify-email`,
    });
    logger.info(`[Resend Email Verification]: verification email link generated for ${email}`);
    emailUtil.sendWelcome(email, url);
    logger.info(`[Resend Email Verification]: verification email sent to ${email}`);

    ResponseHandler.success(
      res,
      200,
      'Verification email has been resent. Please check your inbox.'
    );
  } catch (error) {
    const status = getErrorStatus(error);
    const message = getFirebaseErrorMessage(error.code);
    logger.error(`[Resend Email Verification][Error][${email}]: ${message}`);
    ResponseHandler.error(res, status, message);
  }
});

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  logger.info(`[Refresh Token]: token refresh started`);

  try {
    // Verify the refresh token
    const decoded = JWTUtil.verifyToken(refreshToken);
    const { uid } = decoded;
    logger.info(`[Refresh Token]: refresh token verified for uid: ${uid}`);

    // Generate new access token
    const newAccessToken = JWTUtil.generateToken({ uid });
    // Generate new refresh token
    const newRefreshToken = JWTUtil.generateRefreshToken({ uid });
    logger.info(`[Refresh Token]: new tokens generated for uid: ${uid}`);

    ResponseHandler.success(res, 200, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.message === 'Token has expired') {
      logger.error(`[Refresh Token][Error]: refresh token has expired`);
      ResponseHandler.error(res, 401, 'Refresh token has expired');
    } else {
      logger.error(`[Refresh Token][Error]: invalid refresh token`);
      ResponseHandler.error(res, 401, 'Invalid refresh token');
    }
  }
});

module.exports = {
  register,
  login,
  googleSignIn,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getUser,
  resendEmailVerification,
  refreshAccessToken,
};
