const express = require('express');

const router = express.Router();
const tableController = require('../controllers/table.controller');
const validate = require('../middlewares/validator.middleware');
const tableValidation = require('../validations/table.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post(
  '/create-table',
  auth,
  validate(tableValidation.createTable),
  tableController.createTable
);

router.get('/get-tables', auth, tableController.getTablesByUserId);

router.patch(
  '/update-table/:tableId',
  auth,
  validate(tableValidation.tableIdValidation),
  tableController.updateTable
);

router.delete(
  '/delete-table/:tableId',
  auth,
  validate(tableValidation.tableIdValidation),
  tableController.deleteTable
);

module.exports = router;
