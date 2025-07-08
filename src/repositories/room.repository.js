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
  getFilteredRooms: async (filters) => {
    let query = `
      SELECT 
        r.*,
        rt.name AS room_type_name,
        rt.max_people,
        rl.name AS room_level_name,
        f.name AS floor_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      JOIN floors f ON r.floor_id = f.floor_id
    `;

    const values = [];

    if (filters.min_price) {
      values.push(filters.min_price);
      query += ` AND r.price >= $${values.length}`;
    }
    if (filters.max_price) {
      values.push(filters.max_price);
      query += ` AND r.price <= $${values.length}`;
    }
    if (filters.room_type) {
      values.push(filters.room_type);
      query += ` AND r.room_type_id = $${values.length}`;
    }
    if (filters.people) {
      values.push(filters.people);
      query += ` AND rt.max_people >= $${values.length}`;
    }

    if (filters.check_in_date && filters.check_out_date) {
      query += ` AND r.room_id NOT IN (
        SELECT bd.room_id 
        FROM booking_details bd
        JOIN bookings b ON bd.booking_id = b.booking_id
        WHERE 
          NOT (bd.check_in_date > $${values.length + 2} OR bd.check_out_date < $${values.length + 1})
      )`;
      values.push(filters.check_in_date, filters.check_out_date);
    }
    const roomResult = await pool.query(query, values);
    const rooms = roomResult.rows;
    if (rooms.length === 0) return [];

    const roomIds = rooms.map((room) => room.room_id);

    // Lấy thông tin tiện nghi
    const amenityQuery = `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon, a.description
      FROM room_amenities ra
      JOIN amenities a ON ra.amenity_id = a.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `;
    const amenityResult = await pool.query(amenityQuery, [roomIds]);

    // Lấy thông tin hình ảnh
    const imageQuery = `
      SELECT room_id, image_url
      FROM room_images
      WHERE room_id = ANY($1::int[])
    `;
    const imageResult = await pool.query(imageQuery, [roomIds]);

    const amenitiesMap = {};
    for (const row of amenityResult.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push({
        amenity_id: row.amenity_id,
        name: row.name,
        icon: row.icon,
        description: row.description,
      });
    }

    const imagesMap = {};
    for (const row of imageResult.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    const roomsWithData = rooms.map((room) => ({
      room_id: room.room_id,
      name: room.name,
      description: room.description,
      price: room.price,
      status: room.status,
      roomType: room.room_type_name,
      roomLevel: room.room_level_name,
      floor: room.floor_name,
      max_people: room.max_people,
      amenities: amenitiesMap[room.room_id] || [],
      images: imagesMap[room.room_id] || [],
    }));

    return roomsWithData;
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

