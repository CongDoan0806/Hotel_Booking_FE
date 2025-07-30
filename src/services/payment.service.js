const bookingRepo = require("../repositories/booking.repository");
const paymentRepo = require("../repositories/payment.repository");
const {
  updateStatusById,
  updateRoomStatusByBookingId,
} = require("../models/booking.model");
const db = require("../config/db");
const { sendBookingEmail } = require("../utils/emailService");


const handleSuccess = async ({
  booking_id,
  method,
  amount,
  card_name,
  card_number,
  exp_date,
}) => {
  const booking = await bookingRepo.findById(booking_id);
  if (!booking) {
    throw new Error("Booking not found");
  }
  
  const existedPayment = await paymentRepo.checkPaymentExists(booking_id);
  if (existedPayment) {
    throw new Error("This booking has already been paid.");
  }

  await updateStatusById(booking_id, "booked");
  await updateRoomStatusByBookingId(booking_id, "booked");
  await bookingRepo.updatePaymentStatusById(booking_id, "paid");

  const paymentRecord = await paymentRepo.createPayment({
    booking_id,
    amount,
    card_name,
    card_number,
    exp_date,
    method,
    paid_at: new Date(),
  });

  const userBookings = await bookingRepo.getBookingInfoById(booking.user_id);
  if (userBookings && userBookings.length > 0) {
    const oldestBooking = userBookings[0]; 
    console.log(oldestBooking)
    const bookingDetails = oldestBooking.booking_details[oldestBooking.booking_details.length-1];
    const user = {
      email: booking.user_email, 
      name: booking.user_name || 'Guest',
    };
    const room = {
      room_type_name: bookingDetails.room_type,
      room_level_name: bookingDetails.room_level,
    };
    const nights = oldestBooking.nights;
    const total_price = oldestBooking.total_discounted_price || oldestBooking.total_price;

    await sendBookingEmail({
      user,
      booking: {
        booking_id: oldestBooking.booking_id.toString(),
        check_in_date: oldestBooking.check_in_date,
        check_out_date: oldestBooking.check_out_date,
      },
      room,
      total_price,
      nights,
    });
  }

  return paymentRecord;
};


const getPaymentByBookingId = async (booking_id) => {
  const { rows } = await db.query(
    "SELECT card_name, card_number, exp_date, method FROM payments WHERE booking_id = $1 ORDER BY paid_at DESC LIMIT 1",
    [booking_id]
  );
  return rows[0] || null;
};

const updateOrCreatePayment = async (booking_id, data) => {
  const { card_name, card_number, exp_date, method } = data;
  const { rows: existing } = await db.query(
    "SELECT * FROM payments WHERE booking_id = $1",
    [booking_id]
  );
  if (existing.length > 0) {
    await db.query(
      `UPDATE payments 
       SET card_name=$1, card_number=$2, exp_date=$3, method=$4
       WHERE booking_id=$5`,
      [card_name, card_number, exp_date, method, booking_id]
    );
  } else {
    await db.query(
      `INSERT INTO payments (booking_id, card_name, card_number, exp_date, method)
       VALUES ($1, $2, $3, $4, $5)`,
      [booking_id, card_name, card_number, exp_date, method]
    );
  }
  return getPaymentByBookingId(booking_id);
};

module.exports = {
  handleSuccess,
  getPaymentByBookingId,
  updateOrCreatePayment,
};
