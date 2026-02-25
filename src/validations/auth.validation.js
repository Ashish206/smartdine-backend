const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message(
        'Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, and one number'
      ),
    fullName: Joi.string().required().min(2).max(50),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const googleSignIn = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    oobCode: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message(
        'Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, and one number'
      ),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    oobCode: Joi.string().required(),
  }),
};

const resendEmailVerification = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  googleSignIn,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
  refreshToken,
};
