const db = require('../config/db');

const create = async ({ booking_id, amount, card_name, card_number, exp_date, method, status, paid_at }) => {
  const [result] = await db.query(
    `INSERT INTO payments (booking_id, amount, card_name, card_number, exp_date, method, status, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [booking_id, amount, card_name, card_number, exp_date, method, status, paid_at]
  );
  return result[0];
};

module.exports = {
  create,
};