require('dotenv').config();
const bcrypt = require('bcryptjs');
const {findByEmail,createUser,updateRefreshToken } = require('../models/auth.model')
const { login, resetPassword, register, logout } = require('../services/auth.service')
const authService = require('../services/auth.service');
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
  const {name, firstname, lastname, email, password, role } = req.body;

  try {
    const result = await register({name, firstname, lastname, email, password, role });
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

exports.logout = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const result = await logout(refreshToken);
    return success(res, result, 'Đăng xuất thành công');
  } catch (error) {
    console.error("Logout error:", error.message);
    return sendError(res, 400, error.message || 'Logout error');
  }
};
// function to handle credential change request

exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail, userId } = req.body;


    const result = await authService.requestEmailChange(userId, newEmail);

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message);
    }
  } catch (error) {
    console.error('[requestEmailChange] Error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const result = await authService.verifyEmailChange(userId, otp);

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message || 400);
    }
  } catch (error) {
    console.error('[verifyEmailChange] Error:', error);
    return sendError(res, 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      return success(res, result.message);
    } else {
      return sendError(res, result.status, result.message || 400);
    }
  } catch (error) {
    return sendError(res, 500);
  }
};
