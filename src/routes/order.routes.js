const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order.controller');
const validate = require('../middlewares/validator.middleware');
const orderValidation = require('../validations/order.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post('/create-order', validate(orderValidation.createOrder), orderController.createOrder);

router.get('/get-orders', auth, orderController.getOrderByUserId);

router.get('/analytics', auth, orderController.getOrderAnalytics);

router.patch(
  '/update-order/:orderId',
  auth,
  validate(orderValidation.orderIdValidation),
  orderController.updateOrder
);

router.get(
  '/get-order/:userId/:orderId',
  validate(orderValidation.orderValidate),
  orderController.getOrder
);

module.exports = router;
