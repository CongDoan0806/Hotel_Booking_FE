require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { connectRedis } = require("../utils/redis");
const { sendOTPEmail } = require("../utils/emailService");
const UserRepo = require("../repositories/user.repository");
const {
  findByEmail,
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

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const requestEmailChange = async (userId, newEmail) => {
  try {
    const redis = connectRedis();
    const user = await UserRepo.getUserById(userId);
    console.log(userId);
    if (!userId) {
      return { success: false, status: 404, message: "User not found" };
    }

    const existing = await UserRepo.getUserByEmail(newEmail);
    if (existing) {
      return { success: false, status: 409, message: "Email already in use" };
    }
    const otp = generateOtp();
    await redis.set(`otp:${userId}`, otp, { ex: 300 });
    console.log("Generated OTP:", otp);
    console.log("Redis key set:", `otp:${userId}`);

    await redis.set(`otp_email:${userId}`, newEmail, { ex: 300 });

    await sendOTPEmail(newEmail, otp);

    return { success: true, message: "OTP sent to new email" };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

const verifyEmailChange = async (userId, otpInput) => {
  try {
    const redis = connectRedis(); 
    const otpStored = await redis.get(`otp:${userId}`);
    console.log("Stored OTP (raw):", JSON.stringify(otpStored));
    console.log("Input OTP (raw):", JSON.stringify(otpInput));

    if (!otpStored) {
      return { success: false, status: 410, message: "OTP expired or invalid" };
    }

    if (otpStored !== otpInput) {
      return { success: false, status: 400, message: "OTP does not match" };
    }

    const newEmail = await redis.get(`otp_email:${userId}`); 
    if (!newEmail) {
      return { success: false, status: 400, message: "New email not found" };
    }
    console.log("New Email:", newEmail);
    await UserRepo.updateEmail(userId, newEmail);
    await redis.del(`otp:${userId}`);
    await redis.del(`otp_email:${userId}`);

    return { success: true, message: "Email updated successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};


const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (currentPassword, hashedPassword) => {
  return await bcrypt.compare(currentPassword, hashedPassword);
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await UserRepo.getUserById(userId);
    console.log("User ID:", userId);
    if (!userId) {
      return { success: false, status: 404, message: "User not found" };
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return {
        success: false,
        status: 401,
        message: "Current password is incorrect",
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, status: 400, message: "Passwords do not match" };
    }

    const hashed = await hashPassword(newPassword);
    await UserRepo.updateUserPassword(userId, hashed);

    return { success: true, message: "Password changed successfully" };
  } catch (err) {
    console.error('Error changing password:', err);
    return { success: false, status: 500, message: "Internal server error" };
  }
};
module.exports = {
  login,
  refreshAccessToken,
  resetPassword,
  register,
  requestEmailChange,
  verifyEmailChange,
  changePassword,
};
