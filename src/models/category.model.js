const { db } = require('../config/firebase');
const logger = require('../config/logger');

const createCategory = async (userId, categoryDetails) => {
  try {
    const categoryRef = db.collection('categories').doc(userId).collection('categories');
    const category = await categoryRef.add({
      createdAt: new Date(),
      ...categoryDetails,
    });

    return category;
  } catch (error) {
    logger.error('Error creating category:', error);
    throw error;
  }
};

const getAllCategory = async (userId) => {
  try {
    const snapshot = await db
      .collection('categories')
      .doc(userId)
      .collection('categories')
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
    throw new Error('Failed to retrieve categories');
  }
};

const updateCategory = async (userId, categoryId, updateData) => {
  try {
    await db
      .collection('categories')
      .doc(userId)
      .collection('categories')
      .doc(categoryId)
      .update(updateData);
  } catch (error) {
    logger.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

const deleteCategory = async (userId, categoryId) => {
  try {
    await db.collection('categories').doc(userId).collection('categories').doc(categoryId).delete();
  } catch (error) {
    logger.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
