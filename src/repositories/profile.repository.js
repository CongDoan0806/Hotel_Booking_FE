const profileModel= require('../models/profile.model');

const createHotelFeedbackRepo = async (user_id, rating, comment) => {
    return await profileModel.createHotelFeedbackModel(user_id, rating, comment);
};

const getFavoriteRoomRepo = async(user_id, limit, offset) => {
    return await profileModel.getFavoriteRoomModel(user_id, limit, offset);
}

const countFavoriteRoomRepo = async(user_id) => {
    return await profileModel.countFavoriteRoomModel(user_id);
}

const deleteFavoriteRoomRepo = async(user_id, room_id) => {
    return await profileModel.deleteFavoriteRoomModel(user_id, room_id);
}

const addFavoriteRoomRepo = async(user_id, room_id) => {
    return await profileModel.addFavoriteRoomModel(user_id, room_id);
}

const getUserAndRoomRepo = async (booking_detail_id) => {
    return await profileModel.getUserAndRoomModel(booking_detail_id)
}

const createRoomFeedbackRepo = async (booking_detail_id, rating, comment) => {
    return await profileModel.createRoomFeedbackModel(booking_detail_id, rating, comment);
}
module.exports = {
    createHotelFeedbackRepo,
    getFavoriteRoomRepo,
    countFavoriteRoomRepo,
    deleteFavoriteRoomRepo,
    addFavoriteRoomRepo,
    createRoomFeedbackRepo,
    getUserAndRoomRepo
};
    