const adminRepo = require('../repositories/admin.repository');

const { mapUserBookings } = require('../utils/mapUserBookings');

const getUserListService = async (page, perPage) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await adminRepo.getUserListRepo(perPage, offset);

  return {
    users: mapUserBookings(rows),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getCheckinGuestsService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await adminRepo.getCheckinGuestsRepo(perPage, offset);

  return {
    users: mapUserBookings(rows, ['is_active']),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getCheckoutGuestsService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;
  const { users: rows, totalUsers } = await adminRepo.getCheckoutGuestsRepo(perPage, offset);

  return {
    users: mapUserBookings(rows, ['is_active']),
    pagination: {
      total: totalUsers,
      page,
      perPage,
      totalPages: Math.ceil(totalUsers / perPage)
    }
  };
};

const getAdminDashboardStatusService = async () => {
  return await adminRepo.getAdminDashboardStatusRepo();  
}

const getAdminDashboardDealService = async () => {
  return await adminRepo.getAdminDashboardDealRepo(); 
}

const getFeedbackService = async () => {
  return await adminRepo.getFeedbackRepo();
};

const getHotelFeedbackService = async () => {
  return await adminRepo.getHotelFeedbackRepo();
}

const getTop5MostBookedRoomsService = async (month, year) => {
  if (!month || !year) {
    throw new Error('Month and year are required');
  }
  return await adminRepo.getTop5MostBookedRoomsRepo(month, year);
};

const getGuestListService = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;

  const [guests, totalItems] = await Promise.all([
    adminRepo.getGuestListRepo(perPage, offset),
    adminRepo.countGuestListRepo(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    guests,
    pagination : {
      currentPage: page,
      perPage,
      totalPages,
      totalItems,
    },
  };
};

const updateUserStatusService = async (user_id, status) => {
  if (!['active', 'blocked'].includes(status.toLowerCase())) {
    throw new Error('Invalid status');
  }
  return await adminRepo.updateUserStatusRepo(user_id, status);
}


const getRateService = async (page = 1, perPage = 10, month, year) => {
  const offset = (page - 1) * perPage;
  if (!month || !year) {
      throw new Error('Month and year are required');
    }
  const [rate, totalItems, best_seller_room, total_nenevue] = await Promise.all([
    adminRepo.getRateRepo(perPage, offset, month, year),
    adminRepo.totalRoomRepo(),
    adminRepo.getBestSellerRoomRepo(month, year),
    adminRepo.getTotalRevenueRepo(month, year)
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    total_room: totalItems,
    best_seller_room,
    total_nenevue,
    rate,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems,
    },
  };
};



module.exports = {
  getUserListService,
  getCheckinGuestsService,
  getCheckoutGuestsService,
  getAdminDashboardStatusService,
  getAdminDashboardDealService,
  getFeedbackService,
  getHotelFeedbackService,
  getTop5MostBookedRoomsService,
  getGuestListService,
  updateUserStatusService,
  getRateService,
};
