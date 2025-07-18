const pool = require("../config/db");

const dealsRepository = {
  getActiveDeals: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM deals
      WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
    `);
    return rows;
  },
  getAllDeals: async () => {
    const {rows} = await pool.query(`
      SELECT * FROM deals`
    );
    return rows;
  },

  createDeal: async ({ title, room_type, discount_rate, start_date, end_date }) => {
    const { rows } = await pool.query(`
      INSERT INTO deals (title, room_type, discount_rate, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [title, room_type, discount_rate, start_date, end_date]
    );
    return rows[0];
  },

  updateDeal: async (id, { title, room_type, discount_rate, start_date, end_date }) => {
    const { rows } = await pool.query(`
      UPDATE deals
      SET title = $1, room_type = $2, discount_rate = $3, start_date = $4, end_date = $5
      WHERE deal_id = $6
      RETURNING *`,
      [title, room_type, discount_rate, start_date, end_date, id]
    );
    return rows[0];
  },

  deleteDeal: async (id) => {
    const { rows } = await pool.query(`DELETE FROM deals WHERE deal_id = $1 RETURNING *`, [id]);
    return rows[0];
  },
};

module.exports = dealsRepository;
