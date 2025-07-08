const pool = require('../config/db')
const { getBookingDetailQuery } = require('../models/booking.model');


async function findConflictingBooking(roomId, checkIn, checkOut) {
  const { rows } = await pool.query(
    `SELECT 1
     FROM booking_details
     WHERE room_id = $1
       AND ($2, $3) OVERLAPS (check_in_date, check_out_date)`,
    [roomId, checkIn, checkOut]
  );
  return rows.length > 0;
}

async function createBooking(userId, totalPrice, client) {
  const { rows } = await client.query(
    `INSERT INTO bookings (user_id, status, total_price, payment_status)
     VALUES ($1, 'pending', $2, 'unpaid')
     RETURNING booking_id`,
    [userId, totalPrice]
  );
  return rows[0].booking_id;
}

async function createBookingDetail(bookingId, detail, client) {
  const { roomId, pricePerUnit, checkIn, checkOut } = detail;
  await client.query(
    `INSERT INTO booking_details
       (booking_id, room_id, price_per_unit, check_in_date, check_out_date)
     VALUES ($1, $2, $3, $4, $5)`,
    [bookingId, roomId, pricePerUnit, checkIn, checkOut]
  );
}

const getBookingInfoById = async (booking_id) => {
  return await getBookingDetailQuery(booking_id);
};

module.exports = { findConflictingBooking, createBooking, createBookingDetail, getBookingInfoById, };
