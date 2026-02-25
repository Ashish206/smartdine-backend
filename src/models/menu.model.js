const { db } = require('../config/firebase');
const logger = require('../config/logger');

const createMenu = async (userId, menuDetails) => {
  try {
    const menuRef = db.collection('menu').doc(userId).collection('menu');
    const menu = await menuRef.add({
      createdAt: new Date(),
      ...menuDetails,
    });

    return menu;
  } catch (error) {
    logger.error('Error creating menu:', error);
    throw error;
  }
};

const getAllMenu = async (userId) => {
  try {
    const snapshot = await db
      .collection('menu')
      .doc(userId)
      .collection('menu')
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
    throw new Error('Failed to retrieve menu');
  }
};

const updateMenu = async (userId, menuId, updateData) => {
  try {
    await db.collection('menu').doc(userId).collection('menu').doc(menuId).update(updateData);
  } catch (error) {
    logger.error('Error updating menu:', error);
    throw new Error('Failed to update menu');
  }
};

const deleteMenu = async (userId, menuId) => {
  try {
    await db.collection('menu').doc(userId).collection('menu').doc(menuId).delete();
  } catch (error) {
    logger.error('Error deleting menu:', error);
    throw new Error('Failed to delete menu');
  }
};

module.exports = {
  createMenu,
  getAllMenu,
  updateMenu,
  deleteMenu,
};
