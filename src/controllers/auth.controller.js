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
exports.requestChange = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 401, 'User not authenticated');

    const { currentPassword, newEmail, newPassword } = req.body;
    await requestCredentialChange(userId, currentPassword, newEmail, newPassword);
    console.log('Credential change requested for user:', userId);
    const msg = newEmail
      ? 'OTP sent to new email'
      : 'Password updated successfully';

    return success(res, null, msg);
  } catch (err) {
    return sendError(res, 400, err.message);
  }
};

exports.confirmChange = async (req, res) => {
  try {
    const { otp } = req.body;
    await confirmCredentialChange(req.user?.id, otp);
    return success(res, null, 'Credentials updated successfully');
  } catch (err) {
    return sendError(res, 400, err.message);
  }
};
