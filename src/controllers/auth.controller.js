const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {findByEmail,createUser,updateRefreshToken } = require('../models/auth.model')
const { login, resetPassword, register } = require('../services/auth.service')


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await login(email, password);

    res.status(200).json({
      message: 'Đăng nhập thành công',
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Lỗi login:', error.message);
    res.status(401).json({ error: error.message || 'Lỗi đăng nhập' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const result = await register({ name, email, password, role });
    res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await resetPassword(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};