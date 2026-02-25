const ResponseHandler = require('../utils/responseHandler');
const MenuModel = require('../models/menu.model');
const CategoryModel = require('../models/category.model');
const SettingsModel = require('../models/settings.model');
const logger = require('../config/logger');

const getCustomerMenu = async (req, res) => {
  const { userId } = req.params;
  logger.info(`[GET CUSTOMER MENU]: retrieving menu for user: ${userId}`);

  try {
    const menu = await MenuModel.getAllMenu(userId);
    const categories = await CategoryModel.getAllCategory(userId);
    const userDetails = await SettingsModel.getSettings(userId);
    delete userDetails.fullName;
    delete userDetails.email;
    delete userDetails.phone;
    delete userDetails.address;
    delete userDetails.createdAt;
    delete userDetails.updatedAt;
    logger.info(`[GET CUSTOMER MENU]: successfully retrived menu for user: ${userId}`);
    ResponseHandler.success(res, 200, 'Customer Menu fetched successfully', {
      menu,
      categories,
      userDetails,
    });
  } catch (error) {
    logger.error(`[Customer Menu][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  getCustomerMenu,
};
