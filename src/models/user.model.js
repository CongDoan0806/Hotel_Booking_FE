const db = require('../config/db');

const findByEmail = (email) =>
  db.query('SELECT * FROM users WHERE email = $1', [email]);

const createUser = (name, email, hashedPassword, role) => {
  return db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, hashedPassword, role]
  );
};
module.exports = {
    findByEmail,
    createUser,
};

