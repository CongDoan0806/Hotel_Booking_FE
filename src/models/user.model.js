const db = require('../config/db');

const findByEmail = (email) =>
  db.query('SELECT * FROM users WHERE email = $1', [email]);

const createUser = (firstName, lastName, email, hashedPassword, role) => {
  return db.query(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
    [firstName, lastName, email, hashedPassword, role]
  );
};

module.exports = {
    findByEmail,
    createUser,
};

