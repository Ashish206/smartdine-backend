const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    description: Joi.string().optional().allow('').max(255),
    image_url: Joi.string().optional().allow('').uri(),
    is_active: Joi.boolean().optional(),
    display_order: Joi.number().optional().min(0),
  }),
};

const categoryIdValidation = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

module.exports = {
  createCategory,
  categoryIdValidation,
};
