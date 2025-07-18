const {createHotelFeedbackService} = require('../services/profile.service');
const { success, sendError } = require('../utils/response');

const createHotelFeedbackController = async (req, res) => {
  try {
    const { user_id, rating, comment } = req.body;

    if (!user_id || !rating || !comment) {
      return sendError(res, 400, "User ID, rating, and comment are required");
    }

    const feedback = await createHotelFeedbackService(user_id, rating, comment);
    return success(res, feedback, "Hotel feedback created successfully");
  } catch (err) {
    console.error('Error creating hotel feedback:', err);
    return sendError(res, 500, "Error while creating hotel feedback");
  }
}

module.exports = {
    createHotelFeedbackController
};  