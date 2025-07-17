const paymentService = require("../services/payment.service");
const { success, sendError } = require("../utils/response");
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { booking_id, method, amount, card_name, card_number, exp_date } = req.body;

    if (!booking_id || !amount || !method || !card_name || !card_number || !exp_date) {
      return sendError(res, 400, "Missing required fields");
    }
    const result = await paymentService.handleSuccess({
      booking_id,
      method,
      amount,
      card_name,
      card_number,
      exp_date: formattedExpDate,
    });

    if (!result) {
      return sendError(res, 404, "Booking not found or update failed");
    }
    return success(res, null, "Payment processed successfully");
  } catch (err) {
    console.error("[Payment Error]", err);
    return sendError(res, 500, "Internal server error");
  }
};

exports.getSavedPayment = async (req, res) => {
  try {
    const booking_id = req.params.booking_id;
    if (!booking_id) {
      return sendError(res, 400, "Missing booking_id");
    }
    const data = await paymentService.getPaymentByBookingId(booking_id);
    return success(res, data, "Fetched payment info");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const booking_id = req.body.booking_id;
    if (!booking_id) {
      return sendError(res, 400, "Missing booking_id");
    }
    const { card_name, card_number, exp_date, method } = req.body;
    if (!card_name || !/^[\p{L}\s]+$/u.test(card_name)) {
      return sendError(res, 400, "Please enter a valid card name");
    }
    if (!/^\d{16}$/.test(card_number)) {
      return sendError(res, 400, "Invalid card number");
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp_date)) {
      return sendError(res, 400, "Invalid expiration date");
    }
    const [month, year] = exp_date.split("/");
    const formattedExpDate = `20${year}-${month}-01`;
    const exp = new Date(formattedExpDate);
    const now = new Date();
    if (exp < now) {
      return sendError(res, 400, "Card expired");
    }
    if (exp < now) {
      return sendError(res, 400, "Card expired");
    }
    const updated = await paymentService.updateOrCreatePayment(booking_id, {
      card_name,
      card_number,
      exp_date: formattedExpDate,
      method,
    });
    return success(res, updated, "Payment method updated successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
