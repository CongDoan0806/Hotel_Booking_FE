const Room = require("../models/room.model");
const pool = require("../config/db");

const roomRepository = {
  getAll: async (page = 1, perPage = 10) => {
    const offset = (page - 1) * perPage;

    const query = `SELECT r.room_id, r.name, r.description, r.price, r.status,
                rt.name AS room_type_name, rt.max_people,
                rl.name AS room_level_name, f.name AS floor_name
               FROM rooms r
               JOIN room_types rt ON r.room_type_id = rt.room_type_id
               JOIN room_levels rl ON r.room_level_id = rl.room_level_id
               JOIN floors f ON r.floor_id = f.floor_id
               ORDER BY r.room_id
               LIMIT $1 OFFSET $2`;

    const countQuery = `SELECT COUNT(*) FROM rooms`;

    const result = await pool.query(query, [perPage, offset]);
    const countResult = await pool.query(countQuery);

    const total = parseInt(countResult.rows[0].count);
    const rooms = result.rows;

    const roomIds = rooms.map((room) => room.room_id);
    const imageQuery = `SELECT room_id, image_url FROM room_images WHERE room_id = ANY($1::int[])`;
    const imageResult = await pool.query(imageQuery, [roomIds]);

    const imagesMap = {};
    imageResult.rows.forEach(({ room_id, image_url }) => {
      if (!imagesMap[room_id]) imagesMap[room_id] = [];
      imagesMap[room_id].push(image_url);
    });

    const roomsWithImages = rooms.map((room) => ({
      ...room,
      image_url: imagesMap[room.room_id]?.[0] || null,
    }));

    return {
      data: roomsWithImages,
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  },

  getById: async (id) => {
    const result = await pool.query(
      `SELECT r.room_id, r.name, r.description, r.price, r.status,
              r.room_type_id, r.room_level_id, r.floor_id,
              rt.name AS room_type_name, rt.description AS room_type_description,
              rt.max_people, rt.default_price
       FROM rooms r
       LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
       WHERE r.room_id = $1`,
      [id]
    );
    return result.rows[0];
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
      console.error("Error updating room:", error);
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
        r.room_type_id,
        rt.name AS room_type_name,
        rt.max_people,
        rl.name AS room_level_name,
        f.name AS floor_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      JOIN room_levels rl ON r.room_level_id = rl.room_level_id
      JOIN floors f ON r.floor_id = f.floor_id
      WHERE 1=1
    `;

    const values = [];
    const amenityFilters = filters.amenities
      ? filters.amenities.split(",")
      : [];

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
        WHERE NOT (bd.check_in_date > $${values.length + 2} OR bd.check_out_date < $${values.length + 1})
      )`;
      values.push(filters.check_in_date, filters.check_out_date);
    }

    if (amenityFilters.length > 0) {
      query += ` AND r.room_id IN (
        SELECT ra.room_id
        FROM room_amenities ra
        WHERE ra.amenity_id = ANY($${values.length + 1}::int[])
        GROUP BY ra.room_id
        HAVING COUNT(DISTINCT ra.amenity_id) = $${values.length + 2}
      )`;
      values.push(amenityFilters, amenityFilters.length);
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

    const roomIds = rooms.map((room) => room.room_id);

    const amenityQuery = `
      SELECT ra.room_id, a.amenity_id, a.name, a.icon, a.description
      FROM room_amenities ra
      JOIN amenities a ON ra.amenity_id = a.amenity_id
      WHERE ra.room_id = ANY($1::int[])
    `;
    const amenityResult = await pool.query(amenityQuery, [roomIds]);

    const imageQuery = `
      SELECT room_id, image_url
      FROM room_images
      WHERE room_id = ANY($1::int[])
    `;
    const imageResult = await pool.query(imageQuery, [roomIds]);

    const dealQuery = `
      SELECT d.room_type, d.discount_rate
      FROM deals d
      WHERE d.start_date <= CURRENT_DATE AND d.end_date >= CURRENT_DATE
        AND d.room_type IN (
          SELECT DISTINCT room_type_id FROM rooms WHERE room_type_id = ANY($1::int[])
        )
    `;
    const dealResult = await pool.query(dealQuery, [
      rooms.map((r) => r.room_type_id),
    ]);

    const dealsMap = {};
    dealResult.rows.forEach((deal) => {
      dealsMap[deal.room_type] = deal.discount_rate;
    });

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

    const roomsWithData = rooms.map((room) => {
      const hasDeal = dealsMap.hasOwnProperty(room.room_type_id);

      const deal = hasDeal
        ? {
            discount_rate: dealsMap[room.room_type_id],
            final_price: room.price * (1 - dealsMap[room.room_type_id]),
          }
        : null;

      return {
        room_id: room.room_id,
        name: room.name,
        description: room.description,
        price: room.price,
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

    let filteredRooms = roomsWithData;

    if (filters.has_deal === 'true') {
      filteredRooms = roomsWithData.filter((room) => room.deal !== null);
    } else if (filters.has_deal === 'false') {
      filteredRooms = roomsWithData.filter((room) => room.deal === null);
    }

    return filteredRooms;
  },


  findRoomById: async (id) => {
    return await Room.findById(id);
  },

  createRoom: async (roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const roomId = await Room.create(roomData, client);
      if (Array.isArray(roomData.image_urls)) {
        for (const url of roomData.image_urls) {``
          await Room.insertRoomImage(roomId, url, client);
        }
      } else if (roomData.image_url) {
        await Room.insertRoomImage(roomId, roomData.image_url, client);
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
      console.error("Error in createRoom:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  isRoomAvailable: async (roomId, checkIn, checkOut) => {
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
  },

  getRoomDetail: async (roomId) => {
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
  },
};

module.exports = roomRepository;
