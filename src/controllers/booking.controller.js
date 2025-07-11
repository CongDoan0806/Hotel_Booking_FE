const roomRepository = require('../repositories/room.repository');
const { getBookingDetailsByUserId,confirmBookingService, createBookingWithDetails } = require('../services/booking.service');
const { validateBookingInput } = require('../validations/booking.validate');
const { success, sendError } = require('../utils/response');
const validateParams = require('../middlewares/validateParams');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
   const userId = req.user?.user_id || req.user?.id;
    // console.log('🔥 req.user =', userId);


    const errors = await validateBookingInput({ roomId, checkInDate, checkOutDate });

    if (errors.length > 0) {
      return sendError(res, 400, "Invalid booking input", errors);
    }

    const room = await roomRepository.getRoomDetail(roomId);
    if (!room) {
      return sendError(res, 404, "Room not found");
    }

    const booking = await createBookingWithDetails(
      userId,
      room,
      checkInDate,
      checkOutDate
    );

   return success(
  res,
  {
    booking_id: booking.booking_id,
    user_id: userId // 👈 Thêm dòng này
  },
  "Booking created successfully",
  201
);

  } catch (err) {
    console.error("Booking error:", err);
    return sendError(res, 500, "Server error", [err.message]);
  }
};
// get booking detail
const getBookingDetailsByUserIdController = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id, 10);

    if (isNaN(user_id)) {
      return sendError(res, 400, "Invalid user ID", ["user_id must be a number"]);
    }

    const data = await getBookingDetailsByUserId(user_id);

    return success(res, data, "Get bookings for user successfully");
  } catch (err) {
    return sendError(res, 404, "No bookings found for this user", [err.message]);
  }
};
const confirmBookingController = async (req, res) => {
  try {
    const result = await confirmBookingService(req.params.booking_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createBookingWithDetails,
  createBooking,
  getBookingDetailsByUserIdController,
  confirmBookingController
};
