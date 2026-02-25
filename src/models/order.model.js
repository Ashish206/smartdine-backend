const { db } = require('../config/firebase');
const logger = require('../config/logger');

const createOrder = async (userId, details) => {
  try {
    const orderRef = db.collection('orders').doc(userId).collection('orders');
    const order = await orderRef.add({
      createdAt: new Date(),
      ...details,
    });

    return order;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

const getAllOrders = async (userId, options = {}) => {
  try {
    const { limit = 10, startDate, endDate, lastSnapshot: lastVisible } = options;

    // 1. Create a base query for both data and count
    let baseQuery = db.collection('orders').doc(userId).collection('orders');

    // 2. Apply Filters to the base query
    if (startDate) {
      baseQuery = baseQuery.where('createdAt', '>=', new Date(startDate));
    }
    if (endDate) {
      baseQuery = baseQuery.where('createdAt', '<=', new Date(endDate));
    }

    // 3. Get Total Count efficiently (No document downloads)
    // Uses count() which is 10x - 100x faster and much cheaper
    const countSnapshot = await baseQuery.count().get();
    const total = countSnapshot.data().count;

    // 4. Apply Pagination and Ordering for the actual data
    let dataQuery = baseQuery.orderBy('createdAt', 'desc');

    if (lastVisible) {
      dataQuery = dataQuery.startAfter(lastVisible);
    }

    const snapshot = await dataQuery.limit(limit).get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { orders, total, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to retrieve orders');
  }
};

const updateOrder = async (userId, orderId, updateData) => {
  try {
    await db.collection('orders').doc(userId).collection('orders').doc(orderId).update(updateData);
  } catch (error) {
    logger.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
};

const getOrder = async (userId, orderId) => {
  try {
    const doc = await db.collection('orders').doc(userId).collection('orders').doc(orderId).get();
    if (!doc.exists) {
      return null;
    }
    return { ...doc.data() };
  } catch (error) {
    throw new Error('Failed to retrieve order');
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrder,
};
