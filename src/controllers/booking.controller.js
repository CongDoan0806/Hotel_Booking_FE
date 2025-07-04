const roomRepository = require('../repositories/room.repository');
const bookingService = require('../services/booking.service');
const { validateBookingInput } = require('../validations/booking.validate');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const userId = req.user?.user_id; // lấy từ middleware JWT

    const errors = await validateBookingInput({
      roomId,
      checkInDate,
      checkOutDate,
    });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const room = await roomRepository.getRoomDetail(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const booking = await bookingService.createBookingWithDetails(
      userId,
      room,
      checkInDate,
      checkOutDate
    );

    res.status(201).json({ booking_id: booking.booking_id });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};
