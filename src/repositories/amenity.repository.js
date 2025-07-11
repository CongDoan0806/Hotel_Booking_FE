const pool = require("../config/db");

const amenityRepository = {
  getAllAmenities: async () => {
    const { rows } = await pool.query("SELECT * FROM amenities");
    return rows;
  },
};

module.exports = amenityRepository;