const Room = require("../models/room.model");
const pool = require("../config/db");

const roomRepository = {
  getAll: async function () {
    const result = await pool.query(`
      SELECT 
        r.room_id, r.name, r.description, r.price, r.status,
        r.room_type_id, r.room_level_id, r.floor_id,
        rt.name AS room_type_name, rt.description AS room_type_description,
        rt.max_people, rt.default_price
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
      ORDER BY r.room_id DESC
    `);
    return result.rows;
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

  update: async function (
    id,
    { name, description, price, status, room_type_id, room_level_id, floor_id }
  ) {
    const result = await pool.query(
      `
      UPDATE rooms SET 
        name = $1, 
        description = $2, 
        price = $3, 
        status = $4, 
        room_type_id = $5,
        room_level_id = $6,
        floor_id = $7
      WHERE room_id = $8
      RETURNING *
      `,
      [
        name,
        description,
        price,
        status,
        room_type_id,
        room_level_id,
        floor_id,
        id,
      ]
    );
    return result.rows[0];
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

  createRoom: async function (roomData) {
    return await Room.create(roomData);
  },
};

module.exports = roomRepository;
