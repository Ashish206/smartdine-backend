const { db, auth } = require('../config/firebase');
const logger = require('../config/logger');

const create = async (userId, details, user) => {
  try {
    const ref = db.collection('kitchenUsers').doc(userId).collection('kitchenUsers');
    const res = await ref.add({
      createdAt: new Date(),
      ...details,
      kid: user.uid,
    });

    return res;
  } catch (error) {
    logger.error('Error creating kitchen user:', error);
    throw error;
  }
};

const getAll = async (userId) => {
  try {
    const snapshot = await db
      .collection('kitchenUsers')
      .doc(userId)
      .collection('kitchenUsers')
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
    throw new Error('Failed to retrieve kitchen users');
  }
};

const getKitcherUser = async (userId, kitchenUid) => {
  try {
    const doc = await db
      .collection('kitchenUsers')
      .doc(userId)
      .collection('kitchenUsers')
      .doc(kitchenUid)
      .get();
    if (!doc.exists) {
      return null;
    }
    return { ...doc.data() };
  } catch (error) {
    throw new Error('Failed to retrieve kitchen users');
  }
};

const update = async (userId, id, updateData) => {
  try {
    await db
      .collection('kitchenUsers')
      .doc(userId)
      .collection('kitchenUsers')
      .doc(id)
      .update(updateData);
  } catch (error) {
    logger.error('Error updating kitchen user:', error);
    throw new Error('Failed to update kitchen user');
  }
};

const deleteKitchenUser = async (userId, kitchenUserId, uid) => {
  try {
    await db
      .collection('kitchenUsers')
      .doc(userId)
      .collection('kitchenUsers')
      .doc(kitchenUserId)
      .delete();
    await auth.deleteUser(uid);
  } catch (error) {
    logger.error('Error deleting kitchen user:', error);
    throw new Error('Failed to delete kitchen user');
  }
};

module.exports = {
  create,
  update,
  getAll,
  deleteKitchenUser,
  getKitcherUser,
};
