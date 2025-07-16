const paymentService = require('../services/payment.service');
const { success, sendError } = require('../utils/response');
// function to handle payment success
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { booking_id, method, amount } = req.body;

    if (!booking_id || !amount || !method) {
      return sendError(res, 400, 'Missing required fields');
    }

    const result = await paymentService.handleSuccess({
      booking_id,
      method,
      amount,
    });

    if (!result) {
      return sendError(res, 404, 'Booking not found or update failed');
    }

    return success(res, null, 'Payment processed successfully');
  } catch (err) {
    console.error('[Payment Error]', err);
    return sendError(res, 500, 'Internal server error');
  }
};
