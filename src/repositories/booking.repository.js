const pool = require("../config/db");
const bookingModel = require("../models/booking.model");

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

const getAllBookingsWithDetails = async () => {
  const query = `
    SELECT
      b.booking_id,
      u.name AS user_name,
      r.name AS room_name,
      bd.check_in_date,
      bd.check_out_date,
      b.status
    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN "users" u ON b.user_id = u.user_id
    JOIN rooms r ON bd.room_id = r.room_id
    ORDER BY bd.check_in_date;
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách booking chi tiết:", error);
    throw error;
  }
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
  getAllBookingsWithDetails,
};
