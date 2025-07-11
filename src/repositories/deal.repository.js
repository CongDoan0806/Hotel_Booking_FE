const pool = require("../config/db");

const dealsRepository = {
  getActiveDeals: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM deals 
      WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
    `);
    return rows;
  },

  createDeal: async (dealData) => {
    const { room_type, discount_rate, start_date, end_date } = dealData;
    const { rows } = await pool.query(
      `INSERT INTO deals (room_type, discount_rate, start_date, end_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [room_type, discount_rate, start_date, end_date]
    );
    return rows[0];
  },
};

module.exports = dealsRepository;
