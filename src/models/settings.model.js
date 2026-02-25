const { db } = require('../config/firebase');
const logger = require('../config/logger');

const getSettings = async (userId) => {
  try {
    const snapshot = await db.collection('users').doc(userId).get();
    if (!snapshot.exists) {
      return {};
    }
    return snapshot.data();
  } catch (error) {
    throw new Error('Failed to retrieve settings');
  }
};

const updateSettings = async (userId, updateData) => {
  try {
    await db.collection('users').doc(userId).update(updateData);
  } catch (error) {
    logger.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
