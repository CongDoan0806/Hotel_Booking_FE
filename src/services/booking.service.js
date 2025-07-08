const pool = require("../config/db");
const bookingRepo = require("../repositories/booking.repository");
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
  const isConflict = await bookingRepo.findConflictingBooking(
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

    await client.query(
      `UPDATE rooms SET status = 'booked' WHERE room_id = $1`,
      [room.room_id]
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
