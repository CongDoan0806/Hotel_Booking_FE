const Room = require("../models/room.model");
const pool = require("../config/db");

const roomRepository = {
  getAll: async (page = 1, perPage = 10) => {
    const countResult = await pool.query("SELECT COUNT(*) FROM rooms");
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (page - 1) * perPage;

    const result = await pool.query(
      `
      SELECT 
        r.room_id, r.name, r.description, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
        rl.name AS room_level_name, rl.price AS room_level_price,
        f.name AS floor_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      LEFT JOIN floors f ON r.floor_id = f.floor_id
      ORDER BY r.room_id DESC
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset]
    );

    const rooms = result.rows;
    const roomIds = rooms.map((r) => r.id);

    const amenities = await pool.query(
      `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon
      FROM room_amenities ra
      JOIN amenities a ON a.amenity_id = ra.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `,
      [roomIds]
    );

    const images = await pool.query(
      `SELECT room_id, image_url FROM room_images WHERE room_id = ANY($1::int[])`,
      [roomIds]
    );

    const amenitiesMap = {};
    for (const row of amenities.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push(row);
    }

    const imagesMap = {};
    for (const row of images.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    const fullRooms = rooms.map((room) => ({
      ...room,
      price: (room.room_type_price || 0) + (room.room_level_price || 0),
      amenities: amenitiesMap[room.id] || [],
      images: imagesMap[room.id] || [],
    }));

    return {
      data: fullRooms,
      pagination: {
        currentPage: page,
        perPage,
        totalPages,
        totalItems,
      },
    };
  },

  getById: async (id) => {
    const result = await pool.query(
      `
      SELECT 
        r.room_id, r.name, r.description, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.max_people, rt.price AS room_type_price,
        rl.name AS room_level_name, rl.price AS room_level_price,
        f.name AS floor_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      LEFT JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      LEFT JOIN floors f ON r.floor_id = f.floor_id
      WHERE r.room_id = $1
    `,
      [id]
    );

    const room = result.rows[0];
    if (!room) return null;

    const amenityResult = await pool.query(
      `SELECT a.* FROM room_amenities ra JOIN amenities a ON ra.amenity_id = a.amenity_id WHERE ra.room_id = $1`,
      [id]
    );

    const imageResult = await pool.query(
      `SELECT image_url FROM room_images WHERE room_id = $1`,
      [id]
    );

    room.price = (room.room_type_price || 0) + (room.room_level_price || 0);
    room.amenities = amenityResult.rows;
    room.images = imageResult.rows.map((r) => r.image_url);

    return room;
  },

  update: async (roomId, roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updatedRoom = await Room.update(roomId, roomData, client);

      if (Array.isArray(roomData.amenities)) {
        await Room.deleteRoomAmenities(roomId, client);
        for (const amenity of roomData.amenities) {
          await Room.insertRoomAmenityByName(roomId, amenity, client);
        }
      }

      await client.query("COMMIT");
      return {
        message: "Room updated successfully",
        room: updatedRoom,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  remove: async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM room_images WHERE room_id = $1`, [id]);
      await client.query(`DELETE FROM room_amenities WHERE room_id = $1`, [id]);
      const result = await client.query(
        `DELETE FROM rooms WHERE room_id = $1 RETURNING *`,
        [id]
      );
      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  getFilteredRooms: async (filters) => {
    let query = `
      SELECT 
          r.*, 
          rt.name AS room_type_name,
          rt.max_people,
          rt.price AS base_price,
          rl.name AS room_level_name,
          rl.price AS level_price,
          f.name AS floor_name,
          d.deal_id AS deal_id,
          d.deal_name AS deal_name,
          d.discount_rate AS deal_discount_rate
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      JOIN floors f ON r.floor_id = f.floor_id
      LEFT JOIN deals d 
          ON r.deal_id = d.deal_id
          AND d.start_date <= CURRENT_DATE 
          AND d.end_date >= CURRENT_DATE
      WHERE 1=1
    `;

    const values = [];
    const amenityFilters = filters.amenities
      ? filters.amenities.split(",").map(Number)
      : [];

    if (filters.min_price) {
      values.push(filters.min_price);
      query += ` AND (rt.price + rl.price) >= $${values.length}`;
    }

    if (filters.max_price) {
      values.push(filters.max_price);
      query += ` AND (rt.price + rl.price) <= $${values.length}`;
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
      const idx1 = values.length + 1;
      const idx2 = values.length + 2;
      query += `
        AND r.room_id NOT IN (
          SELECT bd.room_id
          FROM booking_details bd
          JOIN bookings b ON bd.booking_id = b.booking_id
          WHERE NOT (
            bd.check_out_date < $${idx1} OR 
            bd.check_in_date > $${idx2}
          )
        )
      `;
      values.push(filters.check_in_date, filters.check_out_date);
    }

    if (amenityFilters.length > 0) {
      values.push(amenityFilters, amenityFilters.length);
      const idxA1 = values.length - 1;
      const idxA2 = values.length;
      query += `
        AND r.room_id IN (
          SELECT ra.room_id
          FROM room_amenities ra
          WHERE ra.amenity_id = ANY($${idxA1}::int[])
          GROUP BY ra.room_id
          HAVING COUNT(DISTINCT ra.amenity_id) = $${idxA2}
        )
      `;
    }

    if (filters.status) {
      values.push(filters.status);
      query += ` AND r.status = $${values.length}`;
    }

    if (filters.room_level) {
      values.push(filters.room_level);
      query += ` AND r.room_level_id = $${values.length}`;
    }

    if (filters.floor) {
      values.push(filters.floor);
      query += ` AND r.floor_id = $${values.length}`;
    }

    const roomResult = await pool.query(query, values);
    const rooms = roomResult.rows;
    if (rooms.length === 0) return [];

    const roomIds = rooms.map((r) => r.room_id);

    // Lấy tiện ích
    const amenityQuery = `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon
      FROM room_amenities ra
      JOIN amenities a ON ra.amenity_id = a.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `;
    const amenityResult = await pool.query(amenityQuery, [roomIds]);

    // Lấy ảnh
    const imageQuery = `
      SELECT room_id, image_url
      FROM room_images
      WHERE room_id = ANY($1::int[])
    `;
    const imageResult = await pool.query(imageQuery, [roomIds]);

    // Gộp dữ liệu
    const amenitiesMap = {};
    for (const row of amenityResult.rows) {
      if (!amenitiesMap[row.room_id]) amenitiesMap[row.room_id] = [];
      amenitiesMap[row.room_id].push({
        amenity_id: row.amenity_id,
        name: row.name,
        icon: row.icon,
      });
    }

    const imagesMap = {};
    for (const row of imageResult.rows) {
      if (!imagesMap[row.room_id]) imagesMap[row.room_id] = [];
      imagesMap[row.room_id].push(row.image_url);
    }

    let finalRooms = rooms.map((room) => {
      const basePrice = parseFloat(room.base_price || 0);
      const levelPrice = parseFloat(room.level_price || 0);
      const totalPrice = basePrice + levelPrice;
      const finalPrice = room.deal_discount_rate
        ? totalPrice * (1 - room.deal_discount_rate)
        : totalPrice;

      const deal = room.deal_name
        ? {
            deal_id: room.deal_id,
            deal_name: room.deal_name,
            discount_rate: room.deal_discount_rate,
          }
        : null;

      return {
        room_id: room.room_id,
        name: room.name,
        description: room.description,
        price: totalPrice,
        final_price: finalPrice,
        status: room.status,
        roomType: room.room_type_name,
        room_type_id: room.room_type_id,
        roomLevel: room.room_level_name,
        floor: room.floor_name,
        max_people: room.max_people,
        amenities: amenitiesMap[room.room_id] || [],
        images: imagesMap[room.room_id] || [],
        deal: deal,
      };
    });

    if (filters.has_deal === "true") {
      finalRooms = finalRooms.filter((room) => room.deal !== null);
    } else if (filters.has_deal === "false") {
      finalRooms = finalRooms.filter((room) => room.deal === null);
    }

    return finalRooms;
  },

  findRoomById: async (id) => {
    return await RoomService.getById(id);
  },

  createRoom: async (roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const roomId = await Room.create(roomData, client);

      if (Array.isArray(roomData.image_urls)) {
        for (const url of roomData.image_urls) {
          await Room.insertRoomImage(roomId, url, client);
        }
      }
      if (Array.isArray(roomData.amenities)) {
        for (const amenity of roomData.amenities) {
          await Room.insertRoomAmenityByName(roomId, amenity, client);
        }
      }

      await client.query("COMMIT");
      return {
        message: "Room created successfully",
        room_id: roomId,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  isRoomAvailable: async (roomId, checkIn, checkOut) => {
    const { rows } = await pool.query(
      `
    SELECT 1
    FROM rooms r
    LEFT JOIN booking_details bd ON r.room_id = bd.room_id
      AND NOT (
        bd.check_in_date <= $2 OR
        bd.check_out_date >= $3
      )
    WHERE r.room_id = $1
      AND r.status = 'available'
      AND bd.booking_id IS NULL
    `,
      [roomId, checkIn, checkOut]
    );

    return rows.length > 0;
  },

  getRoomDetail: async (roomId) => {
    const { rows } = await pool.query(
      `
    SELECT
      r.room_id,
      r.description,
      (rl.price + rt.price) AS price, -- Tính giá từ room_level + room_type
      rl.price AS room_level_price,
      rt.price AS room_type_price,
      COALESCE(img.images, '[]')     AS images,
      COALESCE(am.amenities, '[]')   AS amenities
    FROM rooms r
    JOIN room_levels rl ON r.room_level_id = rl.room_level_id
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
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
  },
};

module.exports = roomRepository;
