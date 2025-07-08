const pool = require('../config/db');

async function findConflictingBooking(roomId, checkIn, checkOut) {
  const { rows } = await pool.query(
    `SELECT 1
     FROM booking_details
     WHERE room_id = $1
       AND ($2, $3) OVERLAPS (check_in_date, check_out_date)`,
    [roomId, checkIn, checkOut]
  );
  return rows.length > 0;
}

async function createBooking(userId, totalPrice, client) {
  const { rows } = await client.query(
    `INSERT INTO bookings (user_id, status, total_price, payment_status)
     VALUES ($1, 'pending', $2, 'unpaid')
     RETURNING booking_id`,
    [userId, totalPrice]
  );
  return rows[0].booking_id;
}

async function createBookingDetail(bookingId, detail, client) {
  const { roomId, pricePerUnit, checkIn, checkOut } = detail;
  await client.query(
    `INSERT INTO booking_details
       (booking_id, room_id, price_per_unit, check_in_date, check_out_date)
     VALUES ($1, $2, $3, $4, $5)`,
    [bookingId, roomId, pricePerUnit, checkIn, checkOut]
  );
}

async function getBookingDetail(bookingId) {
  const { rows } = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.user_id,
      b.total_price,
      b.status,
      b.payment_status,
      bd.room_id,
      bd.check_in_date,
      bd.check_out_date,
      bd.price_per_unit,
      r.description AS room_description,
      r.room_type_id,
      r.price AS room_price
    FROM bookings b
    JOIN booking_details bd ON b.booking_id = bd.booking_id
    JOIN rooms r ON bd.room_id = r.room_id
    WHERE b.booking_id = $1
    `,
    [bookingId]
  );

  if (rows.length === 0) return null;

  const base = {
    booking_id: rows[0].booking_id,
    user_id: rows[0].user_id,
    total_price: rows[0].total_price,
    status: rows[0].status,
    payment_status: rows[0].payment_status,
    created_at: rows[0].created_at,
    details: [],
  };

  for (const row of rows) {
    base.details.push({
      room_id: row.room_id,
      room_type_id: row.room_type_id,
      price_per_unit: row.price_per_unit,
      status:row.status,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
    });
  }

  return base;
}

module.exports = {
  findConflictingBooking,
  createBooking,
  createBookingDetail,
  getBookingDetail, // 👈 nhớ export
};