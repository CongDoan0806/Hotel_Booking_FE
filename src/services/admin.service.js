const { getUserListModel } = require('../models/admin.model');
const { getCheckinGuestsRepo, getCheckoutGuestsRepo, getAdminDashboardStatusRepo, getAdminDashboardDealRepo , getFeedbackRepo, getTop5MostBookedRoomsRepo, getHotelFeedbackRepo} = require('../repositories/admin.repository');

const groupGuestsByUser = (rawData) => {
  const groupedData = {};

  rawData.forEach((row) => {
    const {
      user_id, email, role, is_active,
      booking_id, booking_status, payment_status,
      booking_detail_id, service_name, quantity, price_per_unit, check_in_date, check_out_date,
      room_id, room_name, room_description, room_price, room_type_id, floor_id
    } = row;

    if (!groupedData[user_id]) {
      groupedData[user_id] = {
        user_id,
        email,
        role,
        is_active,
        bookings: {}
      };
    }

    if (booking_id) {
      if (!groupedData[user_id].bookings[booking_id]) {
        groupedData[user_id].bookings[booking_id] = {
          booking_id,
          status: booking_status,
          payment_status,
          total_price: 0,
          booking_details: []
        };
      }

      const detailPrice = price_per_unit ? parseFloat(price_per_unit) * Number(quantity || 1) : 0;
      groupedData[user_id].bookings[booking_id].total_price += detailPrice;

      if (booking_detail_id) {
        groupedData[user_id].bookings[booking_id].booking_details.push({
          booking_detail_id,
          service_name,
          quantity,
          price_per_unit,
          check_in_date,
          check_out_date,
          room: room_id && {
            room_id,
            name: room_name,
            description: room_description,
            price: room_price,
            room_type_id,
            floor_id
          }
        });
      }
    }
  });

  return Object.values(groupedData).map(user => ({
    ...user,
    bookings: Object.values(user.bookings).map(b => ({
      ...b,
      total_price: b.total_price.toFixed(2)
    }))
  }));
};

const getUserlistService = async (page = 1, perPage = 10) => {
  const rawData = await getUserListModel();
  const fullResult = groupGuestsByUser(rawData);

  const totalItems = fullResult.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedUsers = fullResult.slice(startIndex, startIndex + perPage);

  return {
    users: paginatedUsers,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems
    }
  };
};

const getCheckinGuestsService = async (page = 1, perPage = 10) => {
  const rawData = await getCheckinGuestsRepo();
  const fullResult = groupGuestsByUser(rawData);

  const totalItems = fullResult.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedUsers = fullResult.slice(startIndex, startIndex + perPage);

  return {
    users: paginatedUsers,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems
    }
  };
};

const getCheckoutGuestsService = async (page = 1, perPage = 10) => {
  const rawData = await getCheckoutGuestsRepo();
  const fullResult = groupGuestsByUser(rawData);

  const totalItems = fullResult.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedUsers = fullResult.slice(startIndex, startIndex + perPage);

  return {
    users: paginatedUsers,
    pagination: {
      currentPage: page,
      perPage,
      totalPages,
      totalItems
    }
  };
};

const getAdminDashboardStatusService = async () => {
  return await getAdminDashboardStatusRepo();  
}

const getAdminDashboardDealService = async () => {
  return await getAdminDashboardDealRepo(); 
}

const getFeedbackService = async () => {
  return await getFeedbackRepo();
};

const getHotelFeedbackService = async () => {
  return await getHotelFeedbackRepo();
}

const getTop5MostBookedRoomsService = async () => {
  return await getTop5MostBookedRoomsRepo();
};

module.exports = {
  getUserlistService,
  getCheckinGuestsService,
  getCheckoutGuestsService,
  getAdminDashboardStatusService,
  getAdminDashboardDealService,
  getFeedbackService,
  getHotelFeedbackService,
  getTop5MostBookedRoomsService
};
