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

const getBookingByUserId = async (user_id) => {
  const query = `
    SELECT
      b.booking_id,
      b.user_id,
      b.total_price,
      b.status AS booking_status,
      b.payment_status,
      bd.booking_detail_id,
      bd.service_name,
      bd.quantity,
      bd.price_per_unit,
      bd.note,
      bd.check_in_date,
      bd.check_out_date,
      r.room_id,
      r.name AS room_name,
      r.description AS room_description,
      r.price AS room_price,
      rt.room_type_id,
      rt.name AS room_type
    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN rooms r ON bd.room_id = r.room_id
    LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
    WHERE b.user_id = $1
    ORDER BY b.booking_id DESC;
  `;

  const values = [user_id];
  const result = await pool.query(query, values);
  return result.rows;
};


const updateStatusById = async (bookingId, status = 'confirmed') => {
  const query = `UPDATE bookings SET status = $1 WHERE booking_id = $2`;
  const result = await pool.query(query, [status, bookingId]);
  return result;
};

module.exports = {
  getBookingByUserId,
  updateStatusById,
  Booking
};

