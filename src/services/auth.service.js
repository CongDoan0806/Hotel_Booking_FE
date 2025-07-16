require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { connectRedis } = require("../utils/redis");
const { sendOTPEmail } = require("../utils/emailService");
const UserRepo = require("../repositories/user.repository");
const {
  findByEmail,
  findById,
  updateRefreshToken,
  updatePassword,
  createUser,
} = require("../models/auth.model");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const login = async (email, password) => {
  const result = await findByEmail(email);
  const user = result.rows[0];

  if (!user) throw new Error("Sai email hoặc mật khẩu");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai email hoặc mật khẩu");

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
  if (!refreshToken) throw new Error("No refresh token");

  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const result = await findById(payload.user_id);
  const user = result.rows[0];

  if (!user || user.refresh_token !== refreshToken) {
    throw new Error("Refresh token không hợp lệ");
  }

  return generateAccessToken(user);
};

const resetPassword = async (email, password) => {
  if (!email || !email.includes("@")) {
    throw new Error("Email không hợp lệ");
  }

  if (!password || password.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  }

  const result = await findByEmail(email);
  const user = result.rows[0];
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await updatePassword(user.user_id, hashedPassword);

  return { message: "Đặt lại mật khẩu thành công", password };
};
// functions for change password and email

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const requestCredentialChange = async (
  userId,
  currentPassword,
  newEmail,
  newPassword
) => {
  const user = await UserRepo.getUserById(userId);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Incorrect current password");

  if (!newEmail && !newPassword) {
    throw new Error("Nothing to change");
  }

  if (!newEmail) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserRepo.updateEmailAndPassword(userId, null, hashed);
    return;
  }

  const otp = generateOTP();
  const ttl = 10 * 60; // 10 phút
  const redis = await connectRedis();

  if (!redis) {
    throw new Error("Redis connection failed");
  }

  await redis.set(`otp:${userId}`, otp, { EX: ttl });
  await redis.set(
    `otp_data:${userId}`,
    JSON.stringify({
      newEmail,
      newPassword: newPassword ? await bcrypt.hash(newPassword, 10) : null,
    }),
    { EX: ttl }
  );

  await sendOTPEmail(newEmail, otp);
};


const confirmCredentialChange = async (userId, otpInput) => {
  const redis = await connectRedis();
  const savedOtp = await redis.get(`otp:${userId}`);
  const rawData = await redis.get(`otp_data:${userId}`);

  if (!savedOtp || savedOtp !== otpInput)
    throw new Error("Invalid or expired OTP");
  const { newEmail, newPassword } = JSON.parse(rawData);

  await UserRepo.updateEmailAndPassword(userId, newEmail, newPassword);

  await redis.del(`otp:${userId}`);
  await redis.del(`otp_data:${userId}`);
};

module.exports = {
  login,
  refreshAccessToken,
  resetPassword,
  register,
  requestCredentialChange,
  confirmCredentialChange,
};
