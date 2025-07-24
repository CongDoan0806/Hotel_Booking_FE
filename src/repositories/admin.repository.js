const {getUserListModel,
    getCheckinGuestsModel, 
    getCheckoutGuestsModel, 
    getAdminDashboardStatusModel, 
    getAdminDashboardDealModel, 
    getFeedbackModel, 
    getTop5MostBookedRoomsModel, 
    getHotelFeedbackModel, 
    getGuestListModel,
    countGuestListModel,
    updateUserStatusModel} = require('../models/admin.model');

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

const getGuestListRepo = async (limit, offset)  => {
    return await getGuestListModel(limit, offset) ;
}

const countGuestListRepo = async () => {
    return await countGuestListModel();
}

const updateUserStatusRepo = async (user_id, status) => {
    return await updateUserStatusModel(user_id, status);
}
module.exports = {
    getUserListRepo,
    getCheckinGuestsRepo,
    getCheckoutGuestsRepo,
    getAdminDashboardStatusRepo,
    getAdminDashboardDealRepo,
    getFeedbackRepo,
    getTop5MostBookedRoomsRepo,
    getHotelFeedbackRepo,
    getGuestListRepo,
    countGuestListRepo,
    updateUserStatusRepo
}