"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("room_images", {
      room_image_id: {
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
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uploaded_date: {
        type: Sequelize.DATE || Sequelize.NOW, // Default to current date if not provided
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("room_images");
  },
};
