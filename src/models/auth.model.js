const db = require('../config/db');

const findByEmail = (email) =>
  db.query('SELECT * FROM users WHERE email = $1', [email]);

const createUser = (name, email, hashedPassword, role) => {
  return db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, hashedPassword, role]
  );
};

const updatePassword = (userId, hashedPassword) => {
  return db.query(
    'UPDATE users SET password = $1 WHERE user_id = $2',
    [hashedPassword, userId]
  );
};

const updateRefreshToken = (userId, refreshToken) =>
  db.query(`UPDATE users SET refresh_token = $1 WHERE user_id = $2`, [refreshToken, userId]);

const findUserByRefreshToken = (refreshToken) =>
  db.query(`SELECT * FROM users WHERE refresh_token = $1`, [refreshToken]);

module.exports = {
    findByEmail,
    createUser,
    updateRefreshToken,
    findUserByRefreshToken,
    updatePassword,
};

