const express = require('express');

const router = express.Router();
const customerMenuController = require('../controllers/customer.controller');
const validate = require('../middlewares/validator.middleware');
const customerMenuValidation = require('../validations/customerMenu.validation');

router.get(
  '/get-customer-menu/:userId',
  validate(customerMenuValidation.userIdValidation),
  customerMenuController.getCustomerMenu
);

module.exports = router;
