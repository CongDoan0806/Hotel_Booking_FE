const pool = require("../config/db");
const {
  findConflictingBooking,
  createBooking,
  createBookingDetail,
  getBookingInfoById,
  getDealDiscount,
  updateBookingStatusToConfirmed,
  getBookingSummaryById
} = require("../repositories/booking.repository");

const dayjs = require("dayjs");

const createBookingWithDetails = async (userId, room, checkIn, checkOut) => {
  const isConflict = await findConflictingBooking(
    room.room_id,
    checkIn,
    checkOut
  );
  if (isConflict) throw new Error("Room is unavailable for the selected dates");

  const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
  if (nights <= 0) throw new Error("Invalid date range");

  const discount = await getDealDiscount(room.room_type_id, checkIn, checkOut);
  const totalPrice = nights * room.price * (1 - discount);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingId = await createBooking(userId, totalPrice, client);

    await createBookingDetail(
      bookingId,
      {
        roomId: room.room_id,
        pricePerUnit: room.price,
        checkIn,
        checkOut,
      },
      client
    );

    await client.query("COMMIT");

    return {
      booking_id: bookingId,
      total_price: totalPrice,
      nights,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getBookingDetailsByUserId = async (user_id) => {
  const rows = await getBookingInfoById(user_id);

  if (rows.length === 0) throw new Error("No bookings found for this user");

  const groupedBookings = {};

  rows.forEach((r) => {
    const bookingId = r.booking_id;
    const checkInDate = new Date(r.check_in_date);
    const checkOutDate = new Date(r.check_out_date);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const quantity = Number(r.quantity || 1);

    if (!groupedBookings[bookingId]) {
      groupedBookings[bookingId] = {
        booking_id: r.booking_id,
        user_id: r.user_id,
        status: r.booking_status,
        check_in_date: r.check_in_date,
        check_out_date: r.check_out_date,
        nights,
        total_price: 0,
        total_discounted_price: 0,
        booking_details: [],
      };
    }

    const unit_price = Number(r.room_type_price || 0) + Number(r.room_level_price || 0);
    const discounted_unit_price = Number(r.discounted_unit_price || unit_price); // fallback nếu không có deal

    const detailPrice = unit_price * quantity * nights;
    const discountedPrice = discounted_unit_price * quantity * nights;

    groupedBookings[bookingId].total_price += detailPrice;
    groupedBookings[bookingId].total_discounted_price += discountedPrice;

    groupedBookings[bookingId].booking_details.push({
      room_id: r.room_id,
      room_name: r.room_name,
      room_type: r.room_type,
      room_type_price: r.room_type_price,
      room_level: r.room_level,
      room_level_price: r.room_level_price,
      quantity,
      unit_price,
      discounted_unit_price,
      deal_discount_rate: r.discount_rate,
      price_per_unit: r.price_per_unit, // bạn có thể bỏ nếu không cần
    });
  });

  const result = Object.values(groupedBookings).map((b) => ({
    ...b,
    total_price: Number(b.total_price.toFixed(2)),
    total_discounted_price: Number(b.total_discounted_price.toFixed(2)),
    room_quantity: b.booking_details.length,
  }));

  return result;
};


const confirmBookingService = async (booking_id) => {
  const result = await updateBookingStatusToConfirmed(booking_id);

  if (result.affectedRows === 0) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    message: "Booking confirmed successfully",
  };
};

const getBookingSummaryDetailService = async (booking_detail_id) => {
  const data = await getBookingSummaryById(booking_detail_id);
  if (!data) throw new Error('Booking detail not found');
  return data;
};

module.exports = {
  createBookingWithDetails,
  getBookingDetailsByUserId,
  confirmBookingService,
  getBookingSummaryDetailService
};
