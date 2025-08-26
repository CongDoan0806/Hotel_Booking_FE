"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      room_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      room_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "room_types",
          key: "room_type_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      room_level_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "room_levels",
          key: "room_level_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      floor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "floors",
          key: "floor_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      description: {
        type: Sequelize.TEXT,
      },
      status: {
        type: "room_status_enum",
        defaultValue: "available",
      },
      deal_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "deals",
          key: "deal_id",
        },  
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rooms");
  },
};
