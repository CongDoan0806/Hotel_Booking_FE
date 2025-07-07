const UserModel = require('../models/auth.model');

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

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserPassword,
};
