const pool = require('../config/db');

const create = async ({ booking_id, amount, method, status, paid_at }) => {
  const query = `
    INSERT INTO payments (booking_id, amount, method, status, paid_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const result = await pool.query(query, [booking_id, amount, method, status, paid_at]);
  return result.rows[0];
};

module.exports = {
  create,
};