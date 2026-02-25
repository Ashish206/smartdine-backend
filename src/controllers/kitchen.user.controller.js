const { auth } = require('../config/firebase');
const ResponseHandler = require('../utils/responseHandler');
const KitchenUserModel = require('../models/kitchen.users.model');
const logger = require('../config/logger');

const create = async (req, res) => {
  const userId = req.user.uid; // From auth middleware
  const { email, password, name } = req.body;

  logger.info(`[Create Kitchen user]: Kitchen user creation started for user: ${userId}`);

  try {
    const kitchen = await auth.createUser({
      email,
      password,
      displayName: name,
      kitchenUser: true,
      emailVerified: false,
    });
    const kitchenUser = await KitchenUserModel.create(userId, req.body, kitchen);
    logger.info(`[Create Kitchen user]: Kitchen user created successfully for user: ${userId}`);
    ResponseHandler.success(res, 200, 'Kitchen user created successfully', { kitchenUser });
  } catch (error) {
    logger.error(`[Create Kitchen user][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const getAll = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get Kitchen user By user ID]: retrieving Kitchen user for user: ${userId}`);

  try {
    const kitchenUsers = await KitchenUserModel.getAll(userId);
    ResponseHandler.success(res, 200, 'Kitchen user retrieved successfully', {
      kitchenUsers,
    });
  } catch (error) {
    logger.error(`[Get Kitchen user By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const update = async (req, res) => {
  const userId = req.user.uid;
  const { kitchenUserId } = req.params;

  try {
    await KitchenUserModel.update(userId, kitchenUserId, req.body);
    logger.info(
      `[Update Kitchen user]: Kitchen user updated successfully for user: ${userId}, KitchenUserId: ${kitchenUserId}`
    );
    ResponseHandler.success(res, 200, 'Kitchen user updated successfully');
  } catch (error) {
    logger.error(`[Update Kitchen User][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const deleteKitchenUser = async (req, res) => {
  const userId = req.user.uid;
  const { kitchenUserId } = req.params;
  try {
    const { kid } = await KitchenUserModel.getKitcherUser(userId, kitchenUserId);

    await KitchenUserModel.deleteKitchenUser(userId, kitchenUserId, kid);
    logger.info(
      `[Delete Kitchen User]: Kitchen User deleted successfully for user: ${userId}, kitchenUserId: ${kitchenUserId}`
    );
    ResponseHandler.success(res, 200, 'Kitchen User deleted successfully');
  } catch (error) {
    logger.error(`[Delete Kitchen User][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  create,
  getAll,
  update,
  deleteKitchenUser,
};
