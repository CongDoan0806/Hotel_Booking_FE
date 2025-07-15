const UserModel = require('../models/auth.model');
const pool = require("../config/db");
const getUserByEmail = async (email) => {
  const result = await UserModel.findByEmail(email);
  return result.rows[0];
};

const insertUser = async (name, email, password, role = "user") => {
  const result = await UserModel.createUser(name, email, password, role);
  return result.rows[0];
};

const updateUserPassword = (userId, hashedPassword) => {
  return updatePassword(userId, hashedPassword);
};

const getUserById = async (userId) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    return rows[0]; // Trả về người dùng đầu tiên
  };
  
const updateUser = async (userId, userData) => {
    const { first_name, last_name, email, phone, address, avatar_url, gender, date_of_birth, role, is_active } = userData;
    await pool.query(
      `UPDATE users SET 
        first_name = $1, 
        last_name = $2, 
        email = $3, 
        phone = $4, 
        address = $5, 
        avatar_url = $6, 
        gender = $7, 
        date_of_birth = $8, 
        role = $9, 
        is_active = $10 
      WHERE user_id = $11`,
      [first_name, last_name, email, phone, address, avatar_url, gender, date_of_birth, role, is_active, userId]
    );
  };

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserPassword,
  getUserById,
  updateUser

};
