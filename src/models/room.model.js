const pool = require('../config/db');

const Room = {
  findById: async (id) => {
    const query = 'SELECT * FROM rooms WHERE room_id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  create: async (roomData) => {
    const query = `
      INSERT INTO rooms (name, room_type_id, room_level_id, floor_id, status, price, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      roomData.name,
      roomData.room_type_id,
      roomData.room_level_id,
      roomData.floor_id,
      roomData.status || 'available',
      roomData.price,
      roomData.description,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
};

module.exports = Room;