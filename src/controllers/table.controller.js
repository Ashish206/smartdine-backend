const ResponseHandler = require('../utils/responseHandler');
const TableModel = require('../models/table.model');
const logger = require('../config/logger');

/**
 * Create a new table
 */
const createTable = async (req, res) => {
  const userId = req.user.uid; // From auth middleware
  logger.info(`[Create Table]: Table creation started for user: ${userId}`);

  try {
    const table = await TableModel.createTable(userId, req.body);
    logger.info(
      `[Create Table]: Table created successfully for user: ${userId}, TableId: ${table.id}`
    );
    const qrUrl = `${process.env.FRONTEND_URL}/customer-menu?u=${userId}&t=${table.id}`;
    await TableModel.updateTable(userId, table.id, { qr_url: qrUrl });
    logger.info(
      `[Create Table]: QR code created successfully for user: ${userId}, TableId: ${table.id}`
    );
    ResponseHandler.success(res, 200, 'Table created successfully', { table: table.id });
  } catch (error) {
    logger.error(`[Create Table][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

/**
 * Get Table by ID
 */
const getTablesByUserId = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get Tables By user ID]: retrieving tables for user: ${userId}`);

  try {
    const tables = await TableModel.getAllTables(userId);
    ResponseHandler.success(res, 200, 'Tables retrieved successfully', {
      tables,
    });
  } catch (error) {
    logger.error(`[Get Table By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const updateTable = async (req, res) => {
  // Implementation for updating a Menu
  const userId = req.user.uid;
  const { tableId } = req.params;

  try {
    await TableModel.updateTable(userId, tableId, req.body);
    logger.info(
      `[Update Table]: Table updated successfully for user: ${userId}, TableId: ${tableId}`
    );
    ResponseHandler.success(res, 200, 'Table updated successfully');
  } catch (error) {
    logger.error(`[Update Table][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const deleteTable = async (req, res) => {
  // Implementation for deleting a Menu
  const userId = req.user.uid;
  const { tableId } = req.params;
  try {
    await TableModel.deleteTable(userId, tableId);
    logger.info(
      `[Delete Table]: Table deleted successfully for user: ${userId}, TableId: ${tableId}`
    );
    ResponseHandler.success(res, 200, 'Table deleted successfully');
  } catch (error) {
    logger.error(`[Delete Table][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  createTable,
  getTablesByUserId,
  updateTable,
  deleteTable,
};
