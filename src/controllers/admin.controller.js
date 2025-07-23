const { getUserlistService, 
  getCheckinGuestsService, 
  getCheckoutGuestsService,
  getAdminDashboardStatusService, 
  getAdminDashboardDealService, 
  getFeedbackService,
  getTop5MostBookedRoomsService,
  getHotelFeedbackService} = require('../services/admin.service');
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
    return success(res, guests, "Get check-in guests successfully");

  } catch (error) {
    console.error('Error fetching check-in guests:', error);
    return sendError(res, 500, "Error while getting check-in guests");
  }
};

const getCheckoutGuestsController = async (req, res) => {
  try {
    const guests = await getCheckoutGuestsService();
    return success(res, guests, "Get checkout guests successfully");
  } catch (error) {
    console.error('Error fetching checkout guests:', error);
    return sendError(res, 500, "Error while getting checkout guests");
  }
};

const getAdminDashboardStatusController = async (req, res) => {
  try {
    const status = await getAdminDashboardStatusService();
    return success(res, status, "Get admin dashboard status successfully");
  } catch (err) {
    console.error('Error fetching admin dashboard status:', err);
    return sendError(res, 500, "Error while getting admin dashboard status");
  }
};

const getAdminDashboardDealController = async (req, res) => {
  try { 
    const deals = await getAdminDashboardDealService();
    return success(res, deals, "Get admin dashboard deals successfully");
  } catch (err) {
    console.error('Error fetching admin dashboard deals:', err);
    return sendError(res, 500, "Error while getting admin dashboard deals");
  } 
};

const getFeedbackController = async (req, res) => {
  try {
    const feedbacks = await getFeedbackService();
    return success(res, feedbacks, "Get feedbacks successfully");
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    return sendError(res, 500, "Error while getting feedbacks");
  } 
};

const getTop5MostBookedRoomsController = async (req, res) => {
  try {
    const rooms = await getTop5MostBookedRoomsService();
    return success(res, rooms, "Get top 5 most booked rooms successfully");
  } catch (err) {
    console.error('Error fetching top 5 most booked rooms:', err);
    return sendError(res, 500, "Error while getting top 5 most booked rooms");
  }
};

const getHotelFeedbackController = async (req, res) => {
  try {
    const feedbacks = await getHotelFeedbackService();
    return success(res, feedbacks, "Get hotel feedbacks successfully");
  } catch (err) {
    console.error('Error fetching hotel feedbacks:', err);
    return sendError(res, 500, "Error while getting hotel feedbacks");
  }
};
module.exports = {
  getUserListController,
  getCheckinGuestsController,
  getCheckoutGuestsController,
  getAdminDashboardStatusController,
  getAdminDashboardDealController,
  getFeedbackController,
  getTop5MostBookedRoomsController,
  getHotelFeedbackController
};
