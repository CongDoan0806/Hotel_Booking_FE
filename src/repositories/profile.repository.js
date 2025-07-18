const {createHotelFeedbackModel} = require('../models/profile.model');

const createHotelFeedbackRepo = async (user_id, rating, comment) => {
    return await createHotelFeedbackModel(user_id, rating, comment);
};

module.exports = {
    createHotelFeedbackRepo
};
    