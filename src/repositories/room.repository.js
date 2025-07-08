const Room = require("../models/room.model");
const pool = require("../config/db");

const roomRepository = {
  getAll: async function (page = 1, perPage = 10) {
    const countResult = await pool.query("SELECT COUNT(*) FROM rooms");
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (page - 1) * perPage;

    const result = await pool.query(
      `
      SELECT 
        r.room_id AS id, r.name, r.description, r.price, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.description AS room_type_description,
        rt.max_people, rt.default_price
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      ORDER BY r.room_id DESC
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset]
    );

    return {
      data: result.rows,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalPages: totalPages,
        totalItems: totalItems,
      },
    };
  },

  getById: async function (id) {
    const result = await pool.query(
      `
      SELECT 
        r.room_id, r.name, r.description, r.price, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.description AS room_type_description,
        rt.max_people, rt.default_price
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = $1
      `,
      [id]
    );
    return result.rows[0];
  },

  update: async (roomId, roomData) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updatedRoom = await Room.update(roomId, roomData, client);

      if (roomData.amenities) {
        await Room.deleteRoomAmenities(roomId, client);

        const amenitiesList = roomData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");

        for (const name of amenitiesList) {
          const amenityId = await Room.createAmenity(name, client);
          await Room.insertRoomAmenity(roomId, amenityId, client);
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

  remove: async function (id) {
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

  getFilteredRooms: async function (filters) {
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

  findRoomById: async function (id) {
    return await Room.findById(id);
  },

  createRoom: async (roomData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const roomId = await Room.create(roomData, client);
      if (roomData.image_url) {
        await Room.insertRoomImage(roomId, roomData.image_url, client);
      }
      let amenityId = null;
      if (roomData.amenity) {
        amenityId = await Room.createAmenity(roomData.amenity, client);
        await Room.insertRoomAmenity(roomId, amenityId, client);
      }
      await client.query("COMMIT");
      return {
        message: "Room created successfully",
        room_id: roomId,
        amenity_id: amenityId,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in createRoom:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = roomRepository;
