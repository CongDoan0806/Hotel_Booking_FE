const { getUserlistService } = require('../services/admin.service');
const { success, sendError } = require('../utils/response');

const getUserListController = async (req, res) => {
  try {
    const data = await getUserlistService();
    return success(res, data, "Get user list successfully");
  } catch (err) {
    console.error('Error fetching customer bookings:', err);
    return sendError(res, 500, "Error while getting user list");
  }
};

module.exports = {
  getUserListController,
};
