const pool = require("../config/db");

const dealsRepository = {
  getActiveDeals: async function() {
    const { rows } = await pool.query(`
      SELECT * FROM deals
      WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
    `);
    return rows;
  },

  getDealByRoomType: async function(room_type) {
    const { rows } = await pool.query(`
      SELECT * FROM deals WHERE room_type = $1`, [room_type]);
    return rows;
  },

  getAllDeals: async function() {
    const { rows } = await pool.query(`
      SELECT * FROM deals`);
    return rows;
  },

  createDeal: async function({ deal_name, room_type, discount_rate, start_date, end_date }) {
      const overlappingDeals = await pool.query(`
        SELECT * FROM deals
        WHERE room_type = $1 AND (
          (start_date <= $2 AND end_date >= $2) OR
          (start_date <= $3 AND end_date >= $3) OR
          (start_date >= $2 AND end_date <= $3)
        )`, [room_type, start_date, end_date]);

      if (overlappingDeals.rows.length > 0) {
          throw new Error("There is already a deal for this room type that overlaps with the provided dates.");
      }

      this.validateDeal({ start_date, end_date });

      let status;
      const currentDate = new Date();

      if (currentDate < new Date(start_date)) {
        status = 'New';
      } else if (currentDate >= new Date(start_date) && currentDate <= new Date(end_date)) {
        status = 'Ongoing';
      } else {
        status = 'Finished';
      }

      const { rows } = await pool.query(`
        INSERT INTO deals (deal_name, room_type, discount_rate, start_date, end_date, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [deal_name, room_type, discount_rate, start_date, end_date, status]
      );

      return rows[0];
  },

  updateDeal: async function(id, { deal_name, room_type, discount_rate, start_date, end_date }) {
    this.validateDeal({ start_date, end_date });

    const { rows } = await pool.query(`
      UPDATE deals
      SET deal_name = $1, room_type = $2, discount_rate = $3, start_date = $4, end_date = $5
      WHERE deal_id = $6
      RETURNING *`,
      [deal_name, room_type, discount_rate, start_date, end_date, id]
    );
    return rows[0];
  },

  deleteDeal: async function(id) {
    const { rows } = await pool.query(`DELETE FROM deals WHERE deal_id = $1 RETURNING *`, [id]);
    return rows[0];
  },

  validateDeal: function({ start_date, end_date }) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (new Date(start_date) < currentDate) {
      throw new Error("Start date must not be in the past.");
    }
    if (new Date(end_date) < new Date(start_date)) {
      throw new Error("End date must be after start date.");
    }
  },

  getDealById: async function(id) {
    const { rows } = await pool.query(`
      SELECT * FROM deals WHERE deal_id = $1`, [id]);
    return rows[0];
  },

  getDealsByStatus: async function(status) {
    const { rows } = await pool.query(`
      SELECT * FROM deals WHERE status = $1`, [status]);
    return rows;
  },

  updateDealStatus: async function(id) {
    const currentDate = new Date();
    let status;

    const { rows } = await pool.query(`SELECT start_date, end_date FROM deals WHERE deal_id = $1`, [id]);
    if (rows.length > 0) {
      const deal = rows[0];
      if (currentDate < new Date(deal.start_date)) {
        status = 'New';
      } else if (currentDate >= new Date(deal.start_date) && currentDate <= new Date(deal.end_date)) {
        status = 'Ongoing';
      } else {
        status = 'Finished';
      }

      await pool.query(`
        UPDATE deals SET status = $1 WHERE deal_id = $2`,
        [status, id]
      );
    }
  },

  getDealSummary: async function() {
    const { rows } = await pool.query(`
      SELECT 
          COUNT(*) AS total_deals,
          COUNT(CASE WHEN status = 'Ongoing' THEN 1 END) AS ongoing_deals,
          COUNT(CASE WHEN status = 'Finished' THEN 1 END) AS finished_deals
      FROM deals
    `);
    return rows[0];
  },
};

module.exports = dealsRepository;