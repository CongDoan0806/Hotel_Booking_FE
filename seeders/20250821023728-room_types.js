"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("room_types", [
      {
        room_type_id: 1,
        name: "Single",
        max_people: 1,
        price: 50.0,
      },
      {
        room_type_id: 2,
        name: "Double",
        max_people: 2,
        price: 100.0,
      },
      {
        room_type_id: 3,
        name: "Triple",
        max_people: 3,
        price: 200.0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("room_types", null, {});
  },
};
