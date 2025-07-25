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
  return UserModel.updatePassword(userId, hashedPassword);
};

const getUserById = async (userId) => {
    return UserModel.getUserById(userId);
  };
const updateEmail = async (userId, email) => {
  return await UserModel.updateEmail(userId, email);
};

const updateUser = async (userId, userData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address = null,
    avatar_url,
    gender,
    date_of_birth,
    role = 'user',
    is_active = true
  } = userData;

  const result = await pool.query(
    `UPDATE users SET 
      first_name = $1, 
      last_name = $2, 
      email = $3, 
      phone = $4, 
      avatar_url = $5, 
      gender = $6, 
      date_of_birth = $7,
      address = $8,
      role = $9,
      is_active = $10
    WHERE user_id = $11`,
    [
      first_name,
      last_name,
      email,
      phone,
      avatar_url,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
      userId
    ]
  );

  return result.rowCount > 0;
};



module.exports = {
  getUserByEmail,
  insertUser,
  updateUserPassword,
  getUserById,
  updateUser,
  updateEmail,

};

