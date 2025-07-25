const userService = require("../services/user.service");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
    } = req.body;

    let avatar_url = null;
    if (req.file) {
      avatar_url = `/uploads/avatars/${req.file.filename}`;
    }

    const userData = {
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      role,
      is_active,
    };

    if (avatar_url) {
      userData.avatar_url = avatar_url;
    }

    const updated = await userService.updateUser(userId, userData);

    if (!updated) {
      return res.status(404).json({ message: "User not found or not updated" });
    }

    const updatedUser = await userService.getUserById(userId);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateUser,
  upload,
};
