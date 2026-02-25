const express = require('express');

const router = express.Router();
const kitchenUserController = require('../controllers/kitchen.user.controller');
const validate = require('../middlewares/validator.middleware');
const kitchenUserValidator = require('../validations/kitchen.user.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post(
  '/create-kitchen-user',
  auth,
  validate(kitchenUserValidator.kitchenUserIdValidation),
  kitchenUserController.create
);

router.get('/get-kitchen-users', auth, kitchenUserController.getAll);

router.patch(
  '/update-kitchen-user/:kitchenUserId',
  auth,
  validate(kitchenUserValidator.kitchenUserIdValidation),
  kitchenUserController.update
);

router.delete(
  '/delete-kitchen-user/:kitchenUserId',
  auth,
  validate(kitchenUserValidator.kitchenUserIdValidation),
  kitchenUserController.deleteKitchenUser
);

module.exports = router;
