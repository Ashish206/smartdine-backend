const Joi = require('joi');

const createKitchenUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message(
        'Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, and one number'
      ),
    name: Joi.string().required().min(2).max(50),
    userId: Joi.string().required(),
  }),
};

const kitchenUserIdValidation = {
  params: Joi.object().keys({
    kitchenUserId: Joi.string().required(),
  }),
};

module.exports = {
  createKitchenUser,
  kitchenUserIdValidation,
};
