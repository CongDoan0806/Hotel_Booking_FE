const roomRepository = require('../repositories/room.repository');
const bookingService = require('../services/booking.service');
const { validateBookingInput } = require('../validations/booking.validate');
const { success, sendError } = require('../utils/response');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const userId = req.user?.user_id;

    const errors = await validateBookingInput({ roomId, checkInDate, checkOutDate });

    if (errors.length > 0) {
      return sendError(res, 400, "Invalid booking input", errors);
    }

    const room = await roomRepository.getRoomDetail(roomId);
    if (!room) {
      return sendError(res, 404, "Room not found");
    }

    const booking = await bookingService.createBookingWithDetails(
      userId,
      room,
      checkInDate,
      checkOutDate
    );

    return success(res, { booking_id: booking.booking_id }, "Booking created successfully", 201);
  } catch (err) {
    console.error("Booking error:", err);
    return sendError(res, 500, "Server error", [err.message]);
  }
};
