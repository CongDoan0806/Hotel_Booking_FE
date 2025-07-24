const bookingRepo = require("../repositories/booking.repository");
const paymentRepo = require("../repositories/payment.repository");
const { updateStatusById } = require("../models/booking.model");
const db = require("../config/db");

const handleSuccess = async ({
  booking_id,
  method,
  amount,
  card_name,
  card_number,
  exp_date,
}) => {
  const booking = await bookingRepo.findById(booking_id);
  if (!booking) throw new Error("Booking not found");

  await updateStatusById(booking_id, "confirmed");
  await bookingRepo.updatePaymentStatusById(booking_id, "paid");

  const paymentRecord = await paymentRepo.createPayment({
    booking_id,
    amount,
    card_name,
    card_number,
    exp_date,
    method,
    status: "success",
    paid_at: new Date(),
  });
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
