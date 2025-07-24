const db = require('../config/db');

const create = async ({ booking_id, amount, card_name, card_number, exp_date, method, paid_at }) => {
  const { rows } = await db.query(
    `INSERT INTO payments (booking_id, amount, card_name, card_number, exp_date, method, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [booking_id, amount, card_name, card_number, exp_date, method, paid_at]
  );
  return rows[0];
};

module.exports = {
  create,
};