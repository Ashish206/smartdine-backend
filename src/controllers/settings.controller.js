const ResponseHandler = require('../utils/responseHandler');
const SettingsModel = require('../models/settings.model');
const logger = require('../config/logger');

const getSettingsByUser = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get Settings By user ID]: retrieving settings for user: ${userId}`);

  try {
    const settings = await SettingsModel.getSettings(userId);
    ResponseHandler.success(res, 200, 'Settings retrieved successfully', {
      settings,
    });
  } catch (error) {
    logger.error(`[Get Settings By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const updateSettings = async (req, res) => {
  const userId = req.user.uid;

  try {
    await SettingsModel.updateSettings(userId, req.body);
    logger.info(`[Update Settings]: Settings updated successfully for user: ${userId}`);
    ResponseHandler.success(res, 200, 'Settings updated successfully');
  } catch (error) {
    logger.error(`[Update Settings][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  getSettingsByUser,
  updateSettings,
};
