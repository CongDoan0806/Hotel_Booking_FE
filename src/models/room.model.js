const db = require("../config/db");

const getAll = async () => {
  const result = await db.query(`
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
};

const getById = async (id) => {
  const result = await db.query(
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
};

const create = async ({
  name,
  description,
  price,
  status,
  room_type_id,
  room_level_id,
  floor_id,
}) => {
  const result = await db.query(
    `
    INSERT INTO rooms (name, description, price, status, room_type_id, room_level_id, floor_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [name, description, price, status, room_type_id, room_level_id, floor_id]
  );
  return result.rows[0];
};

const update = async (
  id,
  { name, description, price, status, room_type_id, room_level_id, floor_id }
) => {
  const result = await db.query(
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
};

const remove = async (id) => {
  const result = await db.query(
    `DELETE FROM rooms WHERE room_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
const pool = require("../config/db");

const Room = {
  findById: async (id) => {
    const query = "SELECT * FROM rooms WHERE room_id = $1";
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
      roomData.status || "available",
      roomData.price,
      roomData.description,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
};

module.exports = Room;
