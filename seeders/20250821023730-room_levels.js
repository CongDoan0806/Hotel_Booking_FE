"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("room_levels", [
      { room_level_id: 1, name: "Standard", price: 50.0 },
      { room_level_id: 2, name: "Luxury", price: 100.0 },
      { room_level_id: 3, name: "Vip", price: 200.0 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("room_levels", null, {});
  },
};
