"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("floors", {
      floor_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("floors");
  },
};
