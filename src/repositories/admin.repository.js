const {getUserListModel,getCheckinGuestsModel, getCheckoutGuestsModel, getAdminDashboardStatusModel, getAdminDashboardDealModel, getFeedbackModel, getMonthlyOccupancyStatsModel, getTotalRoomsModel, getHotelFeedbackModel} = require('../models/admin.model');

const getUserListRepo = async () => {
    return await getUserListModel();
}

const getCheckinGuestsRepo = async () => {
    return await getCheckinGuestsModel();
}

const getCheckoutGuestsRepo = async () => {
    return await getCheckoutGuestsModel();
}

const getAdminDashboardStatusRepo = async () => {
    return await getAdminDashboardStatusModel();
}

const getAdminDashboardDealRepo = async () => {
    return await getAdminDashboardDealModel(); 
}

const getFeedbackRepo = async () => {
    return await getFeedbackModel();
}

const getMonthlyOccupancyStatsRepo = async (year) => {
  return await getMonthlyOccupancyStatsModel(year);
}

const getTotalRoomsRepo = async () => {
  return await getTotalRoomsModel();
};

const getHotelFeedbackRepo = async () => {
  return await getHotelFeedbackModel();
}

module.exports = {
    getUserListRepo,
    getCheckinGuestsRepo,
    getCheckoutGuestsRepo,
    getAdminDashboardStatusRepo,
    getAdminDashboardDealRepo,
    getFeedbackRepo,
    getMonthlyOccupancyStatsRepo,
    getTotalRoomsRepo,
    getHotelFeedbackRepo
}