const ResponseHandler = require('../utils/responseHandler');
const CategoryModel = require('../models/category.model');
const logger = require('../config/logger');

/**
 * Create a new category
 */
const createCategory = async (req, res) => {
  const userId = req.user.uid; // From auth middleware
  logger.info(`[Create Category]: Category creation started for user: ${userId}`);

  try {
    const category = await CategoryModel.createCategory(userId, req.body);
    logger.info(
      `[Create Category]: Category created successfully for user: ${userId}, CategoryId: ${category.id}`
    );
    ResponseHandler.success(res, 200, 'Category created successfully', { category: category.id });
  } catch (error) {
    logger.error(`[Create Category][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

/**
 * Get Category by ID
 */
const getCategoriesByUserId = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get categories By user ID]: retrieving categories for user: ${userId}`);

  try {
    const categories = await CategoryModel.getAllCategory(userId);
    ResponseHandler.success(res, 200, 'Categories retrieved successfully', {
      categories,
    });
  } catch (error) {
    logger.error(`[Get categories By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const updateCategory = async (req, res) => {
  // Implementation for updating a category
  const userId = req.user.uid;
  const { categoryId } = req.params;

  try {
    await CategoryModel.updateCategory(userId, categoryId, req.body);
    logger.info(
      `[Update Category]: Category updated successfully for user: ${userId}, CategoryId: ${categoryId}`
    );
    ResponseHandler.success(res, 200, 'Category updated successfully');
  } catch (error) {
    logger.error(`[Update Category][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const deleteCategory = async (req, res) => {
  // Implementation for deleting a category
  const userId = req.user.uid;
  const { categoryId } = req.params;
  try {
    await CategoryModel.deleteCategory(userId, categoryId);
    logger.info(
      `[Delete Category]: Category deleted successfully for user: ${userId}, CategoryId: ${categoryId}`
    );
    ResponseHandler.success(res, 200, 'Category deleted successfully');
  } catch (error) {
    logger.error(`[Delete Category][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  createCategory,
  getCategoriesByUserId,
  updateCategory,
  deleteCategory,
};
