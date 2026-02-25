const { db } = require('../config/firebase');
const logger = require('../config/logger');

const createTable = async (userId, tableDetails) => {
  try {
    const tableRef = db.collection('table').doc(userId).collection('table');
    const table = await tableRef.add({
      createdAt: new Date(),
      ...tableDetails,
    });

    return table;
  } catch (error) {
    logger.error('Error creating table:', error);
    throw error;
  }
};

const getAllTables = async (userId) => {
  try {
    const snapshot = await db
      .collection('table')
      .doc(userId)
      .collection('table')
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to retrieve table');
  }
};

const getTableById = async (userId, tableId) => {
  try {
    const doc = await db.collection('table').doc(userId).collection('table').doc(tableId).get();

    if (!doc.exists) {
      throw new Error('Table not found');
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error('Failed to retrieve table');
  }
};

const updateTable = async (userId, tableId, updateData) => {
  try {
    await db.collection('table').doc(userId).collection('table').doc(tableId).update(updateData);
  } catch (error) {
    logger.error('Error updating table:', error);
    throw new Error('Failed to update table');
  }
};

const deleteTable = async (userId, tableId) => {
  try {
    await db.collection('table').doc(userId).collection('table').doc(tableId).delete();
  } catch (error) {
    logger.error('Error deleting table:', error);
    throw new Error('Failed to delete table');
  }
};

module.exports = {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  getTableById,
};
