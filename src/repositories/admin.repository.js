const {getUserListModel,getCheckinGuestsModel, getCheckoutGuestsModel, getAdminDashboardStatusModel, getAdminDashboardDealModel, getFeedbackModel, getTop5MostBookedRoomsModel, getHotelFeedbackModel} = require('../models/admin.model');

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

const getTop5MostBookedRoomsRepo = async () => {
    return await getTop5MostBookedRoomsModel();
}

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
    getTop5MostBookedRoomsRepo,
    getHotelFeedbackRepo
}