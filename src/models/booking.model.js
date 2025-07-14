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

const getBookingSummaryByDetailId = async (booking_detail_id) => {
  const query = `
    SELECT 
      u.first_name,
      u.last_name,
      (u.first_name || ' ' || u.last_name) AS user_name,
      u.avatar_url,
      bd.check_in_date,
      rt.name AS room_type,
      (bd.check_out_date - bd.check_in_date) AS stay_days,
      r.price AS price_per_day,
      (r.price * (bd.check_out_date - bd.check_in_date)) AS total_price,
      COALESCE((r.price * (bd.check_out_date - bd.check_in_date) * d.discount_rate), 0) AS discount_amount,
      (r.price * (bd.check_out_date - bd.check_in_date)) - 
        COALESCE((r.price * (bd.check_out_date - bd.check_in_date) * d.discount_rate), 0) AS final_price
    FROM booking_details bd
    JOIN bookings b ON b.booking_id = bd.booking_id
    JOIN users u ON u.user_id = b.user_id
    JOIN rooms r ON r.room_id = bd.room_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    LEFT JOIN deals d
      ON r.room_type_id = d.room_type
     AND bd.check_in_date BETWEEN d.start_date AND d.end_date
    WHERE bd.booking_detail_id = $1
    LIMIT 1;
  `;
  const result = await pool.query(query, [booking_detail_id]);
  return result.rows[0];
};

module.exports = {
  getBookingByUserId,
  updateStatusById,
  getBookingSummaryByDetailId,
  Booking
};

