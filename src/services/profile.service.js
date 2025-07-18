const {createHotelFeedbackRepo} = require('../repositories/profile.repository');

const createHotelFeedbackService = async (user_id, rating, comment) => {
    if (!rating || !comment) {
        throw new Error("Rating and comment are required");
    }

    return await createHotelFeedbackRepo(user_id, rating, comment);
};

module.exports = {
    createHotelFeedbackService  
};