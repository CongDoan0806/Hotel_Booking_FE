const pool = require("../config/db");
const { bookingRepo, getBookingInfoById, updateBookingStatusToConfirmed} = require("../repositories/booking.repository");

const dayjs = require("dayjs");

async function getDealDiscount(roomTypeId, inDate, outDate) {
  const { rows } = await pool.query(
    `SELECT discount_rate
       FROM deals
       WHERE room_type = $1
  AND ($2, $3) OVERLAPS (start_date, end_date)

       LIMIT 1`,
    [roomTypeId, inDate, outDate]
  );
  return rows[0]?.discount_rate || 0;
}

exports.createBookingWithDetails = async (userId, room, checkIn, checkOut) => {
  // 1. Check trùng lịch
  const isConflict = await bookingRepo.findConflictingBooking(
    room.room_id,
    checkIn,
    checkOut
  );
  if (isConflict) throw new Error("Room is unavailable for the selected dates");

  // 2. Tính giá
  const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
  if (nights <= 0) throw new Error("Invalid date range");

  const discount = await getDealDiscount(room.room_type_id, checkIn, checkOut);
  const totalPrice = nights * room.price * (1 - discount);

  // 3. Transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingId = await bookingRepo.createBooking(
      userId,
      totalPrice,
      client
    );

    await bookingRepo.createBookingDetail(
      bookingId,
      { roomId: room.room_id, pricePerUnit: room.price, checkIn, checkOut },
      client
    );

    await client.query("COMMIT");
    return { booking_id: bookingId, total_price: totalPrice, nights };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getBookingDetails = async (booking_id) => {
  const rows = await getBookingInfoById(booking_id);
  if (rows.length === 0) throw new Error('Booking not found');

  const checkInDate = new Date(rows[0].check_in_date);
  const checkOutDate = new Date(rows[0].check_out_date);
  const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

  const total_price = rows.reduce((sum, r) => {
    return sum + Number(r.quantity) * Number(r.price_per_unit);
  }, 0);
  
  return {
    booking_id: rows[0].booking_id,
    user_id: rows[0].user_id,
    total_price: total_price,
    status: rows[0].status,
    check_in_date: rows[0].check_in_date,
    check_out_date: rows[0].check_out_date,
    nights,
    room_quantity: rows.length, 
    booking_details: rows.map(r => ({
      room_id: r.room_id,
      service_name: r.service_name,
      quantity: r.quantity,
      price_per_unit: r.price_per_unit,
      note: r.note,
      room_type: r.room_type
    }))
  };
};


const confirmBookingService = async (booking_id) => {
  const result = await updateBookingStatusToConfirmed(booking_id);

  if (result.affectedRows === 0) {
    throw new Error('Booking not found');
  }

  return {
    success: true,
    message: 'Booking confirmed successfully',
  };
};
module.exports = {
  getBookingDetails,
  confirmBookingService
};