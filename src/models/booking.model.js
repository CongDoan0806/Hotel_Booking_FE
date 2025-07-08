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

const getBookingDetailQuery = async (booking_id) => {
  const query = `
    SELECT
      b.booking_id,
      b.user_id,
      bd.room_id,
      b.total_price,
      bd.service_name,
      bd.quantity,
      bd.price_per_unit,
      bd.note,
      bd.check_in_date,
      bd.check_out_date,
      rt.name AS room_type
    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN rooms r ON bd.room_id = r.room_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    WHERE b.booking_id = $1;
  `;
  

  const values = [booking_id];

  const result = await pool.query(query, values);
  return result.rows; 
};
module.exports = {
  getBookingDetailQuery,
  Booking
};

