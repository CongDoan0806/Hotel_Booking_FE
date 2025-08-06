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
    console.error("❌ Error updating booking status:", error);
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

async function createBooking(userId, totalPrice, status, client) {
  const { rows } = await client.query(
    `
      INSERT INTO bookings (user_id, total_price, status)
      VALUES ($1, $2, $3)
      RETURNING booking_id, status
    `,
    [userId, totalPrice, status]
  );
  return rows[0];
}

async function createBookingDetail(bookingId, detail, client) {
  const { roomId, pricePerUnit, checkIn, checkOut } = detail;
  await client.query(
    `
    INSERT INTO booking_details
      (booking_id, room_id, price_per_unit, check_in_date, check_out_date)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [bookingId, roomId, pricePerUnit, checkIn, checkOut]
  );
}

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
  createBooking,
  createBookingDetail,
};
