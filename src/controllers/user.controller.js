const userService = require("../services/user.service");

const userController = {
  getUser: async (req, res) => {
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
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
      await userService.updateUser(userId, userData);
      return res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = userController;