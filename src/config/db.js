// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool.connect((err, client, release) => {
//   if (err) {
//     console.error('PostgreSQL connection error:', err.stack);
//   } else {
//     console.log('PostgreSQL connection successful');
//     release(); 
//   }
// });

// module.exports = pool;

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
