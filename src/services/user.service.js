const userRepository = require("../repositories/user.repository");

const userService = {
  getUserById: async (userId) => {
    return await userRepository.getUserById(userId);
  },

  updateUser: async (userId, userData) => {
    await userRepository.updateUser(userId, userData);
    const updatedUser = await userRepository.getUserById(userId); // thêm dòng này
    return updatedUser;
  }
};

module.exports = userService;