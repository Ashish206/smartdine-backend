const Joi = require('joi');

const createMenu = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    description: Joi.string().optional().allow('').max(255),
    category_id: Joi.string().required(),
    base_price: Joi.number().required().min(0),
    food_type: Joi.string().required().valid('veg', 'non-veg', 'egg'),
    is_available: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    preparation_time: Joi.number().optional().min(0),
    spice_level: Joi.string().optional(),
    image_url: Joi.string().optional().allow('').uri(),
    is_active: Joi.boolean().optional(),
    display_order: Joi.number().optional().min(0),
    variants: Joi.array().optional(),
    addons: Joi.array().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

const menuIdValidation = {
  params: Joi.object().keys({
    menuId: Joi.string().required(),
  }),
};

module.exports = {
  createMenu,
  menuIdValidation,
};
