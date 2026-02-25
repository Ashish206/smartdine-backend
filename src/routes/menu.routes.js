const express = require('express');

const router = express.Router();
const menuController = require('../controllers/menu.controller');
const validate = require('../middlewares/validator.middleware');
const menuValidation = require('../validations/menu.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post('/create-menu', auth, validate(menuValidation.createMenu), menuController.createMenu);

router.get('/get-menu', auth, menuController.getMenuByUserId);

router.patch(
  '/update-menu/:menuId',
  auth,
  validate(menuValidation.menuIdValidation),
  menuController.updateMenu
);

router.delete(
  '/delete-menu/:menuId',
  auth,
  validate(menuValidation.menuIdValidation),
  menuController.deleteMenu
);

module.exports = router;
