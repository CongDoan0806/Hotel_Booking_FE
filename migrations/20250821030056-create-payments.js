"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      payment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "bookings",
          key: "booking_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      card_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      card_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      exp_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      method: {
        type: "payment_method_enum", // type bạn tạo trước
        allowNull: false,
      },
      paid_at: {
        type: Sequelize.DATE, // type bạn tạo trước
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
