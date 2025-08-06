const {createHotelFeedbackModel,
    getFavoriteRoomModel,
    countFavoriteRoomModel,
    deleteFavoriteRoomModel
} = require('../models/profile.model');

const createHotelFeedbackRepo = async (user_id, rating, comment) => {
    return await createHotelFeedbackModel(user_id, rating, comment);
};

const getFavoriteRoomRepo = async(user_id, limit, offset) => {
    return await getFavoriteRoomModel(user_id, limit, offset);
}

const countFavoriteRoomRepo = async(user_id) => {
    return await countFavoriteRoomModel(user_id);
}

const deleteFavoriteRoomRepo = async(user_id, room_id) => {
    return await deleteFavoriteRoomModel(user_id, room_id);
}

module.exports = {
    createHotelFeedbackRepo,
    getFavoriteRoomRepo,
    countFavoriteRoomRepo,
    deleteFavoriteRoomRepo
};
    