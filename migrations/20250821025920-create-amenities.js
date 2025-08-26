"use strict";

const { create } = require("lodash");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("amenities", {
      amenity_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, 
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("amenities");
  },
};
