const Room = require('../models/room.model');
const pool = require('../config/db');
const roomRepository = {
  getFilteredRooms: async (filters) => {
    let query = `
      SELECT * FROM rooms WHERE 1=1`;
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

module.exports = roomRepository;