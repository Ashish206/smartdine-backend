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
    const {
      limit = 10,
      startDate,
      endDate,
      lastSnapshot: lastVisible,
      firstSnapshot = null,
    } = options;

    // 1. Create a base query for both data and count
    const collectionRef = db.collection('orders').doc(userId).collection('orders');
    let baseQuery = collectionRef;

    // 2. Apply Filters to the base query
    if (startDate) {
      // Parse startDate as midnight of the day
      baseQuery = baseQuery.where('createdAt', '>=', new Date(`${startDate}T00:00:00`));
    }
    if (endDate) {
      // Parse endDate as end of the day (23:59:59)
      baseQuery = baseQuery.where('createdAt', '<=', new Date(`${endDate}T23:59:59`));
    }

    // 3. Get Total Count efficiently (No document downloads)
    // Uses count() which is 10x - 100x faster and much cheaper
    const countSnapshot = await baseQuery.count().get();
    const total = countSnapshot.data().count;

    // 4. Apply Pagination and Ordering for the actual data
    let dataQuery = baseQuery.orderBy('createdAt', 'desc');
    if (firstSnapshot) {
      const firstDocSnapshot = await collectionRef.doc(firstSnapshot).get();
      if (firstDocSnapshot.exists) {
        dataQuery = dataQuery.startAt(firstDocSnapshot);
      }
    } else if (lastVisible) {
      // Fetch DocumentSnapshot by id for startAfter
      const lastDocSnapshot = await collectionRef.doc(lastVisible).get();
      if (lastDocSnapshot.exists) {
        dataQuery = dataQuery.startAfter(lastDocSnapshot);
      }
    }
    console.log('====>', startDate, endDate, dataQuery._queryOptions);
    const snapshot = await dataQuery.limit(limit).get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // For pagination, return the id of the last doc as lastVisible
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const lastVisibleValue = lastDoc ? lastDoc.id : null;
    return { orders, total, lastVisible: lastVisibleValue };
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

/**
 * Get analytics for orders in the last N days for a user
 * @param {string} userId
 * @param {number} days - Number of days (e.g., 1, 7, 30)
 * Returns: { orders: [...], count }
 */
const getOrderAnalytics = async (userId, days) => {
  const collectionRef = db.collection('orders').doc(userId).collection('orders');
  const now = new Date();
  let startDate;
  if (days === 1) {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
  }
  const snapshot = await collectionRef.where('createdAt', '>=', startDate).get();
  const orders = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return { total: orders.length, orders };
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrder,
  getOrderAnalytics,
};
