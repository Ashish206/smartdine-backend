const express = require('express');

const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const validate = require('../middlewares/validator.middleware');
const settingsValidation = require('../validations/settings.validation');
const auth = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * @validation Input validation using Joi
 */

router.get('/get-settings', auth, settingsController.getSettingsByUser);

router.patch(
  '/update-settings',
  auth,
  validate(settingsValidation.updateSettings),
  settingsController.updateSettings
);

module.exports = router;
