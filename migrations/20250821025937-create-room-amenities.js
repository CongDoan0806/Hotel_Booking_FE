"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("room_amenities", {
      room_amenity_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "rooms",
          key: "room_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amenity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "amenities",
          key: "amenity_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("room_amenities");
  },
};
