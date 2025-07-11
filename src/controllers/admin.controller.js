const { getUserlistService, getCheckinGuestsService, getCheckoutGuestsService } = require('../services/admin.service');
const { success, sendError } = require('../utils/response');

const getUserListController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const { users, pagination } = await getUserlistService(page, perPage);

    return success(res, { users, pagination }, "Get user list successfully");
  } catch (err) {
    console.error('Error fetching customer bookings:', err);
    return sendError(res, 500, "Error while getting user list");
  }
};

const getCheckinGuestsController = async (req, res) => {
  try {
    const guests = await getCheckinGuestsService();
    res.status(200).json({
      success: true,
      message: 'Danh sách khách đang check-in',
      data: guests
    });
  } catch (error) {
    console.error('Lỗi check-in:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khách check-in'
    });
  }
};

// ✅ Controller: trả danh sách khách đã check-out
const getCheckoutGuestsController = async (req, res) => {
  try {
    const guests = await getCheckoutGuestsService();
    res.status(200).json({
      success: true,
      message: 'Danh sách khách đã check-out',
      data: guests
    });
  } catch (error) {
    console.error('Lỗi check-out:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khách check-out'
    });
  }
};

module.exports = {
  getUserListController,
  getCheckinGuestsController,
  getCheckoutGuestsController
};
