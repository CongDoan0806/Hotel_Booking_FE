const pool = require('../config/db')
const { getBookingByUserId ,updateStatusById} = require('../models/booking.model');


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
const getDealDiscount = async (roomTypeId, inDate, outDate) => {
  const { rows } = await pool.query(
    `SELECT discount_rate
     FROM deals
     WHERE room_type = $1
       AND ($2, $3) OVERLAPS (start_date, end_date)
     LIMIT 1`,
    [roomTypeId, inDate, outDate]
  );
  return rows[0]?.discount_rate || 0;
}

const getBookingInfoById = async (user_id) => {
  return await getBookingByUserId(user_id);
};

const updateBookingStatusToConfirmed = async (bookingId) => {
  try {
    const result = await updateStatusById(bookingId, 'confirmed');
    return result;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái booking:', error);
    throw error;
  }
};


module.exports = { findConflictingBooking, createBooking, createBookingDetail,getDealDiscount, getBookingInfoById,updateBookingStatusToConfirmed };
