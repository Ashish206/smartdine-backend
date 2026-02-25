const Joi = require('joi');

const createOrder = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    tableId: Joi.string().required(),
    order_number: Joi.string().required().min(1).max(20),
    order_type: Joi.string().required(),
    status: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          item_id: Joi.string().required(),
          name: Joi.string().required(),
          quantity: Joi.number().required().min(1),
          unit_price: Joi.number().required().min(0),
          variant: Joi.optional().allow(''),
          addons: Joi.optional(),
          spice_level: Joi.string().optional().allow(''),
          special_instructions: Joi.string().optional().allow(''),
          total_price: Joi.number().required().min(0),
          status: Joi.string().required(),
        })
      )
      .required(),
    subtotal: Joi.number().required().min(0),
    tax_amount: Joi.number().required().min(0),
    service_charge: Joi.number().required().min(0),
    total_amount: Joi.number().required().min(0),
    payment_status: Joi.string().required(),
    payment_method: Joi.string().required(),
    customer_name: Joi.string().optional().allow(''),
    customer_phone: Joi.string().optional().allow(''),
    special_instructions: Joi.string().optional().allow(''),
  }),
};

const orderIdValidation = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const orderValidate = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
    orderId: Joi.string().required(),
  }),
};

module.exports = {
  createOrder,
  orderIdValidation,
  orderValidate,
};
