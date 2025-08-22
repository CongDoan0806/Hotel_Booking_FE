const adminModel = require('../models/admin.model');

const getUserListRepo = async (limit, offset) => {
  const users = await adminModel.getUserListModel(limit, offset);
  const totalUsers = await adminModel.countUsersModel();
  return { users, totalUsers };
};

const getCheckinGuestsRepo = async (limit, offset) => {
  const users = await adminModel.getCheckinGuestsModel(limit, offset);
  const totalUsers = await adminModel.countCheckinGuestsModel();
  return { users, totalUsers };
};

const getCheckoutGuestsRepo = async (limit, offset) => {
  const users = await adminModel.getCheckoutGuestsModel(limit, offset);
  const totalUsers = await adminModel.countCheckoutGuestsModel();
  return { users, totalUsers };
};


const getAdminDashboardStatusRepo = async () => {
    return await adminModel.getAdminDashboardStatusModel();
}

const getAdminDashboardDealRepo = async () => {
    return await adminModel.getAdminDashboardDealModel(); 
}

const getFeedbackRepo = async () => {
    return await adminModel.getFeedbackModel();
}

const getTop5MostBookedRoomsRepo = async (month, year) => {
    return await adminModel.getTop5MostBookedRoomsModel(month, year);
}

const getHotelFeedbackRepo = async () => {
  return await adminModel.getHotelFeedbackModel();
}

const getGuestListRepo = async (limit, offset)  => {
    return await adminModel.getGuestListModel(limit, offset) ;
}

const countGuestListRepo = async () => {
    return await adminModel.countGuestListModel();
}

const updateUserStatusRepo = async (user_id, status) => {
    return await adminModel.updateUserStatusModel(user_id, status);
}

const getRateRepo = async (limit, offset, month, year) => {
    return await adminModel.getRateModel(limit, offset, month, year);
}

const getTotalRevenueRepo = async (month, year) => {
  return await adminModel.getTotalRevenueModel(month, year);
};

const getBestSellerRoomRepo = async (month, year) => {
    return await adminModel.getBestSellerRoomModel(month, year);
}
const totalRoomRepo = async () => {
    return await adminModel.totalRoomModel();
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