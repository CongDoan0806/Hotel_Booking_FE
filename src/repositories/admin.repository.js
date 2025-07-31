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
    updateUserStatusModel,
    getRateModel,
    getTotalRevenueModel,
getBestSellerRoomModel,
totalRoomModel
} = require('../models/admin.model');

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

const getTop5MostBookedRoomsRepo = async (month, year) => {
    return await getTop5MostBookedRoomsModel(month, year);
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

const getRateRepo = async (limit, offset, month, year) => {
    return await getRateModel(limit, offset, month, year);
}

const getTotalRevenueRepo = async (month, year) => {
  return await getTotalRevenueModel(month, year);
};

const getBestSellerRoomRepo = async (month, year) => {
    return await getBestSellerRoomModel(month, year)
}
const totalRoomRepo = async () => {
    return await totalRoomModel();
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
    updateUserStatusRepo,
    getRateRepo,
    getTotalRevenueRepo,
    getBestSellerRoomRepo,
    totalRoomRepo
}