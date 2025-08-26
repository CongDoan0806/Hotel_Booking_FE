"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("floors", [
      { floor_id: 1, name: "Floor 1" },
      { floor_id: 2, name: "Floor 2" },
      { floor_id: 3, name: "Floor 3" },
      { floor_id: 4, name: "Floor 4" },
      { floor_id: 5, name: "Floor 5" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("floors", null, {});
  },
};
