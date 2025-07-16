const bookingRepo = require("../repositories/booking.repository");
const paymentRepo = require("../repositories/payment.repository");
const { updateStatusById } = require("../models/booking.model");
// function to handle successful payment

const handleSuccess = async ({ booking_id, method, amount }) => {
  const booking = await bookingRepo.findById(booking_id); // ✅ truyền số nguyên
  if (!booking) {
    throw new Error('Booking not found');
  }

  await updateStatusById(booking_id, 'confirmed');
  await bookingRepo.updatePaymentStatusById(booking_id, 'paid');

  const paymentRecord = await paymentRepo.createPayment({
    booking_id: booking_id,
    amount,
    method,
    status: 'success',
    paid_at: new Date(),
  });

  return paymentRecord;
};

module.exports = {
  handleSuccess,
};

