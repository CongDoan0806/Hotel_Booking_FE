'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('deals', [
      {
        deal_name: 'Deal for Single',
        discount_rate: 0.1,
        start_date: '2025-07-21',
        end_date: '2025-08-21',
        status: 'Ongoing',
      },
      {
        deal_name: 'Deal for Double',
        discount_rate: 0.15,
        start_date: '2025-07-21',
        end_date: '2025-08-21',
        status: 'Ongoing',
      },
      {
        deal_name: 'Deal for Triple',
        discount_rate: 0.2,
        start_date: '2025-07-21',
        end_date: '2025-08-21',
        status: 'Ongoing',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('deals', null, {});
  }
};
