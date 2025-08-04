const pool = require("../config/db");
const bookingModel = require("../models/booking.model");
//func check conflict schedule book
// async function findConflictingBooking(roomId, checkIn, checkOut) {
//   const { rows } = await pool.query(
//     `SELECT 1
//      FROM booking_details
//      WHERE room_id = $1
//        AND ($2, $3) OVERLAPS (check_in_date, check_out_date)`,
//     [roomId, checkIn, checkOut]
//   );
//   return rows.length > 0;
// }

// func create booking
async function createBooking(userId, totalPrice, client) {
  const { rows } = await client.query(
    `INSERT INTO bookings (user_id, total_price)
     VALUES ($1, $2)
     RETURNING booking_id`,
    [userId, totalPrice]
  );
  return rows[0].booking_id;
}

async function createBookingDetail(bookingId, detail, client) {
  try {
    const { roomId, pricePerUnit, checkIn, checkOut, checkInTimestamp, checkOutTimestamp } = detail;

    await client.query(
      `INSERT INTO booking_details
       (booking_id, room_id, price_per_unit, check_in_date, check_out_date, check_in_timestamp, check_out_timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        bookingId,
        roomId,
        pricePerUnit,
        checkIn || null,
        checkOut || null,
        checkInTimestamp || null,
        checkOutTimestamp || null
      ]
    );
  } catch (err) {
    console.error('Failed to insert booking detail:', err.message);
    throw err;
  }
}


const getDealDiscount = async (roomTypeId, inDate, outDate) => {
  const { rows } = await pool.query(
    `SELECT discount_rate
     FROM deals
     WHERE deal_id = $1
       AND ($2, $3) OVERLAPS (start_date, end_date)
       AND status = 'Ongoing'
     LIMIT 1`,
    [roomTypeId, inDate, outDate]
  );
  return rows[0]?.discount_rate || 0;
};

const getBookingInfoById = async (user_id) => {
  return await bookingModel.getBookingByUserId(user_id);
};

const findById = async (bookingId) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE booking_id = $1`,
    [bookingId]
  );
  return result.rows[0] || null;
};

const updateBookingStatusToConfirmed = async (bookingId) => {
  try {
    const result = await bookingModel.updateStatusById(bookingId, "booked");
    return result;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái booking:", error);
    throw error;
  }
};

const getBookingSummaryById = async (bookingDetailId) => {
  return await bookingModel.getBookingSummaryByDetailId(bookingDetailId);
};

const updatePaymentStatusById = async (bookingId) => {
  const query = `UPDATE bookings SET status = 'booked' WHERE booking_id = $1`;
  const result = await pool.query(query, [bookingId]);
  return result.rowCount > 0;
};

const getBookingsForAutoCheckin = async (currentDate) => {
  return await bookingModel.findBookingsForAutoCheckin(currentDate);
};

const getBookingsForAutoCheckout = async (currentDate) => {
  return await bookingModel.findBookingsForAutoCheckout(currentDate);
};

const updateStatus = async (bookingId, status) => {
  return await bookingModel.updateBookingStatus(bookingId, status);
};
// const autoDeleteExpiredBookingsService = async () => {
//   return await bookingModel.deleteExpiredPendingBookings();
// };

// select date to disable
const getDisabledDatesByRoomId = async (roomId) => {
  const { rows } = await pool.query(
    `
SELECT 
  bd.check_in_timestamp AS check_in,
  bd.check_out_timestamp AS check_out
FROM booking_details bd
JOIN bookings b ON bd.booking_id = b.booking_id
WHERE bd.room_id = $1
  AND b.status IN ('booked', 'checked_in')
ORDER BY bd.check_in_timestamp

    `,
    [roomId]
  );

  return rows;
};
module.exports = {
  createBooking,
  createBookingDetail,
  getDealDiscount,
  getBookingInfoById,
  updateBookingStatusToConfirmed,
  findById,
  getBookingSummaryById,
  updatePaymentStatusById,
  getBookingsForAutoCheckin,
  getBookingsForAutoCheckout,
  updateStatus,
  // autoDeleteExpiredBookingsService,
  getDisabledDatesByRoomId,
};
