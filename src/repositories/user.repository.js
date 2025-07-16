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
  return UserModel.updatePassword(userId, hashedPassword);
};

const getUserById = async (id) => await UserModel.getUserById(id);

const updateEmailAndPassword = async (id, email, password) => {
  const user = await UserModel.getUserById(id);
  user.email = email;
  if (password) user.password = password;
  await UserModel.updatePassword(user.id, user.password);
  await UserModel.requestEmailChange(user.id, user.email);
  return user;
};

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserPassword,
  getUserById,
  updateEmailAndPassword,
};
