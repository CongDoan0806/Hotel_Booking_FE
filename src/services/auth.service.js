const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {findByEmail, findById, updateRefreshToken, updatePassword, createUser} = require('../models/auth.model');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

const login = async (email, password) => {
  const result = await findByEmail(email);
  const user = result.rows[0];

  if (!user) throw new Error('Sai email hoặc mật khẩu');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Sai email hoặc mật khẩu');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateRefreshToken(user.user_id, refreshToken);

  return {
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      is_active: user.is_active,
      avatar: user.avatar_url,
    },
    accessToken,
    refreshToken,
  };
};

const register = async ({ name, email, password, role }) => {
  const existing = await findByEmail(email);
  if (existing.rows.length > 0) {
    throw new Error("Email đã tồn tại");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser(name, email, hashedPassword, role || "user");

  return { message: "Đăng ký thành công" };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token');

  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const result = await findById(payload.user_id);
  const user = result.rows[0];

  if (!user || user.refresh_token !== refreshToken) {
    throw new Error('Refresh token không hợp lệ');
  }

  return generateAccessToken(user);
};

const resetPassword = async (email, password) => {
  if (!email || !email.includes('@')) {
    throw new Error('Email không hợp lệ');
  }

  if (!password || password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  const result = await findByEmail(email);
  const user = result.rows[0];
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await updatePassword(user.user_id, hashedPassword);

  return { message: 'Đặt lại mật khẩu thành công' , password};
};

module.exports = {
  login,
  refreshAccessToken,
  resetPassword,
  register
};