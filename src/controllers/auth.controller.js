require('dotenv').config();
const bcrypt = require('bcryptjs');
const {findByEmail,createUser,updateRefreshToken } = require('../models/auth.model')
const { login, resetPassword, register,requestCredentialChange,confirmCredentialChange } = require('../services/auth.service')
const {success, sendError} = require('../utils/response')

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await login(email, password);

    return success(
      res, 
      {
        user,
        accessToken,
        refreshToken,
      },
      'Login successful'
    )
  } catch (error) {
    console.error('Login error: ', error.message);
    return sendError(res, 401, error.message || 'Login error');
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const result = await register({ name, email, password, role });
    return success(res, result, 'Registration successful', 201);
  } catch (error) {
    console.error("Registration error:", error.message);
    return sendError(res, 400, error.message || 'Registration error')
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await resetPassword(email, password);
    return success(res, result, 'Đặt lại mật khẩu thành công');
  } catch (error) {
    return sendError(res, 400, error.message || 'Lỗi đặt lại mật khẩu');
  }
};
