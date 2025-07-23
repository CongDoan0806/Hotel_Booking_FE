const pool = require('../config/db');

const createHotelFeedbackModel = async (user_id, rating, comment) => {
  const query = `
    INSERT INTO hotel_feedbacks (user_id, rating, comment)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const result = await pool.query(query, [user_id, rating, comment]);
  return result.rows[0];
};
module.exports = {
    createHotelFeedbackModel
}