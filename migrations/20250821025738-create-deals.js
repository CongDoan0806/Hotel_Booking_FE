"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("deals", {
      deal_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deal_name: {
        type: Sequelize.STRING,
      },
      discount_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: 'deal_status_enum',
        defaultValue: 'Ongoing', // Assuming 'Ongoing' is a valid status in the enum
      },
      
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("deals");
  },
};
