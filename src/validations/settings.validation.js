const Joi = require('joi');

const updateSettings = {
  body: Joi.object().keys({
    name: Joi.string().optional().max(100),
    description: Joi.string().optional().allow('').max(500),
    logo_url: Joi.string().optional().allow('').uri(),
    cover_image_url: Joi.string().optional().allow('').uri(),
    cuisine_type: Joi.array().optional(),
    address: Joi.string().optional().allow('').max(200),
    phone: Joi.string().optional().allow('').max(20),
    email: Joi.string().optional().email().max(100),
    gst_number: Joi.string().optional().allow('').max(50),
    opening_hours: Joi.object().optional(),
    is_active: Joi.boolean().optional(),
    currency: Joi.string().optional().max(10),
    tax_percentage: Joi.number().optional().min(0).max(100),
    service_charge_percentage: Joi.number().optional().min(0).max(100),
  }),
};

module.exports = {
  updateSettings,
};
