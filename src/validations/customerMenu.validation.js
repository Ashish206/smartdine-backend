const Joi = require('joi');

const userIdValidation = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  userIdValidation,
};
