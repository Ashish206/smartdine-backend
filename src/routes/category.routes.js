const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validator.middleware');
const categoryValidation = require('../validations/category.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

// Public endpoints with moderate rate limiting
router.post(
  '/create-category',
  auth,
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

router.get('/get-categories', auth, categoryController.getCategoriesByUserId);

router.patch(
  '/update-category/:categoryId',
  auth,
  validate(categoryValidation.categoryIdValidation),
  categoryController.updateCategory
);

router.delete(
  '/delete-category/:categoryId',
  auth,
  validate(categoryValidation.categoryIdValidation),
  categoryController.deleteCategory
);

module.exports = router;
