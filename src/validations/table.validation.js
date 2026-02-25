const Joi = require('joi');

const createTable = {
  body: Joi.object().keys({
    table_number: Joi.string().required().min(1).max(10),
    capacity: Joi.number().required().min(1).max(100),
    location: Joi.string().optional().allow('').max(100),
    is_active: Joi.boolean().optional(),
  }),
};

const tableIdValidation = {
  params: Joi.object().keys({
    tableId: Joi.string().required(),
  }),
};

module.exports = {
  createTable,
  tableIdValidation,
};
