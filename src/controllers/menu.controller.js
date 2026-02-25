const ResponseHandler = require('../utils/responseHandler');
const MenuModel = require('../models/menu.model');
const logger = require('../config/logger');

/**
 * Create a new menu
 */
const createMenu = async (req, res) => {
  const userId = req.user.uid; // From auth middleware
  logger.info(`[Create Menu]: Menu creation started for user: ${userId}`);

  try {
    const menu = await MenuModel.createMenu(userId, req.body);
    logger.info(`[Create Menu]: Menu created successfully for user: ${userId}, MenuId: ${menu.id}`);
    ResponseHandler.success(res, 200, 'Menu created successfully', { menu: menu.id });
  } catch (error) {
    logger.error(`[Create Menu][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

/**
 * Get Menu by ID
 */
const getMenuByUserId = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get Menu By user ID]: retrieving menu for user: ${userId}`);

  try {
    const menu = await MenuModel.getAllMenu(userId);
    ResponseHandler.success(res, 200, 'Menu retrieved successfully', {
      menu,
    });
  } catch (error) {
    logger.error(`[Get Menu By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const updateMenu = async (req, res) => {
  // Implementation for updating a Menu
  const userId = req.user.uid;
  const { menuId } = req.params;

  try {
    await MenuModel.updateMenu(userId, menuId, req.body);
    logger.info(`[Update Menu]: Menu updated successfully for user: ${userId}, MenuId: ${menuId}`);
    ResponseHandler.success(res, 200, 'Menu updated successfully');
  } catch (error) {
    logger.error(`[Update Menu][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const deleteMenu = async (req, res) => {
  // Implementation for deleting a Menu
  const userId = req.user.uid;
  const { menuId } = req.params;
  try {
    await MenuModel.deleteMenu(userId, menuId);
    logger.info(`[Delete Menu]: Menu deleted successfully for user: ${userId}, MenuId: ${menuId}`);
    ResponseHandler.success(res, 200, 'Menu deleted successfully');
  } catch (error) {
    logger.error(`[Delete Menu][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  createMenu,
  getMenuByUserId,
  updateMenu,
  deleteMenu,
};
