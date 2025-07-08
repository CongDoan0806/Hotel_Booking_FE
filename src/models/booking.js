const pool = require('../config/db');

class Booking {
  static async create({ user_id, total_price }) {
    const query = `
      INSERT INTO bookings (user_id, total_price, status, payment_status)
      VALUES ($1, $2, 'pending', 'unpaid')
      RETURNING *;
    `;
    const values = [user_id, total_price];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(booking_id) {
    const query = 'SELECT * FROM bookings WHERE booking_id = $1';
    const result = await pool.query(query, [booking_id]);
    return result.rows[0];
  }
}

module.exports = Booking;