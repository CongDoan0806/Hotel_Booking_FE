const Room = require("../models/room.model");
const pool = require("../config/db");

/* -------------------- CHECK AVAILABILITY -------------------- */
async function isRoomAvailable(roomId, checkIn, checkOut) {
  const { rows } = await pool.query(
    `
    SELECT 1
    FROM booking_details
    WHERE room_id = $1
      AND NOT (
        check_out_date <= $2 OR
        check_in_date >= $3
      )
    `,
    [roomId, checkIn, checkOut]
  );
  return rows.length === 0;
}

async function getRoomDetail(roomId) {
  const { rows } = await pool.query(
    `
    SELECT
      r.room_id,
      r.description,
      r.price,
      COALESCE(img.images, '[]')     AS images,
      COALESCE(am.amenities, '[]')   AS amenities
    FROM rooms r
    LEFT JOIN LATERAL (
      SELECT json_agg(image_url) AS images
      FROM room_images
      WHERE room_id = r.room_id
    ) img ON TRUE
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object('name', a.name, 'icon', a.icon)) AS amenities
      FROM room_amenities ra
      JOIN amenities a ON a.amenity_id = ra.amenity_id
      WHERE ra.room_id = r.room_id
    ) am ON TRUE
    WHERE r.room_id = $1
    `,
    [roomId]
  );

  return rows[0] || null;
}

const roomRepository = {
  getRoomDetail,
  isRoomAvailable,
  getFilteredRooms: async (filters) => {
    let query = `SELECT * FROM rooms WHERE 1=1`;
    const values = [];

    if (filters.min_price) {
      values.push(filters.min_price);
      query += ` AND price >= $${values.length}`;
    }
    if (filters.max_price) {
      values.push(filters.max_price);
      query += ` AND price <= $${values.length}`;
    }
    if (filters.room_type) {
      values.push(filters.room_type);
      query += ` AND room_type_id = $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  findRoomById: async (id) => {
    return await Room.findById(id);
  },

  createRoom: async (roomData) => {
    return await Room.create(roomData);
  },
};

/* -------------------- EXPORT -------------------- */
module.exports = roomRepository;
