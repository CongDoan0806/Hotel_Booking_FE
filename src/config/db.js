const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // quan trọng để tránh lỗi SSL khi deploy
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.stack);
  } else {
    console.log('PostgreSQL connection successful');
    release();
  }
});

module.exports = pool;
