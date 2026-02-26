/* eslint-disable camelcase */
const ResponseHandler = require('../utils/responseHandler');
const OrderModel = require('../models/order.model');
const logger = require('../config/logger');
const TableModel = require('../models/table.model');

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
  const { userId } = req.body; // From auth middleware
  logger.info(`[Create Order]: Order creation started for user: ${userId}`);

  try {
    const { tableId } = req.body;
    const { table_number } = await TableModel.getTableById(userId, tableId);

    const order = await OrderModel.createOrder(userId, { ...req.body, tableName: table_number });
    logger.info(
      `[Create Order]: Order created successfully for user: ${userId}, orderId: ${order.id}`
    );
    ResponseHandler.success(res, 200, 'Order created successfully', { order: order.id });
  } catch (error) {
    logger.error(`[Create Order][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const getOrderByUserId = async (req, res) => {
  const userId = req.user.uid;
  logger.info(`[Get Order By user ID]: retrieving order for user: ${userId}`);

  try {
    const { limit, startDate, endDate, lastSnapshot, firstSnapshot } = req.query;
    const options = {
      limit: limit ? parseInt(limit, 10) : 10,
      startDate,
      endDate,
      lastSnapshot,
      firstSnapshot,
    };
    const { orders, total, lastVisible } = await OrderModel.getAllOrders(userId, options);
    // For next page, client should use lastVisible (createdAt value) as lastSnapshot
    ResponseHandler.success(res, 200, 'Orders retrieved successfully', {
      orders,
      total,
      limit: options.limit,
      lastVisible, // This is the createdAt value of the last doc
    });
  } catch (error) {
    logger.error(`[Get Orders By user ID][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const updateOrder = async (req, res) => {
  // Implementation for updating a Menu
  const userId = req.user.uid;
  const { orderId } = req.params;

  try {
    await OrderModel.updateOrder(userId, orderId, req.body);
    logger.info(
      `[Update Order]: Order updated successfully for user: ${userId}, OrderId: ${orderId}`
    );
    ResponseHandler.success(res, 200, 'Order updated successfully');
  } catch (error) {
    logger.error(`[Update Order][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

const getOrder = async (req, res) => {
  const { userId, orderId } = req.params;
  logger.info(`[Get Order]: retrieving order for user: ${userId}: orderId:${orderId}`);

  try {
    const order = await OrderModel.getOrder(userId, orderId);
    ResponseHandler.success(res, 200, 'Order retrieved successfully', {
      order,
    });
  } catch (error) {
    logger.error(`[Get Orders][Error][${userId}][${orderId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};
/**
 * Get order analytics for 1, 7, and 30 days
 */
const getOrderAnalytics = async (req, res) => {
  const userId = req.user.uid;
  const days = parseInt(req.query.days, 10);
  logger.info(`[Order Analytics]: retrieving analytics for user: ${userId}, days: ${days}`);
  if (![1, 7, 30].includes(days)) {
    ResponseHandler.error(res, 400, 'Invalid days parameter. Allowed values: 1, 7, 30');
    return;
  }
  try {
    const analytics = await OrderModel.getOrderAnalytics(userId, days);
    ResponseHandler.success(res, 200, 'Order analytics retrieved successfully', analytics);
  } catch (error) {
    logger.error(`[Order Analytics][Error][${userId}]: ${error.message}`);
    ResponseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  updateOrder,
  getOrder,
  getOrderAnalytics,
};
