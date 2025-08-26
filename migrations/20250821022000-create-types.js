'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
      CREATE TYPE role_enum AS ENUM ('admin', 'user');
      CREATE TYPE room_type_name_enum AS ENUM ('Single', 'Double', 'Triple');
      CREATE TYPE room_status_enum AS ENUM ('available', 'booked', 'occupied');
      CREATE TYPE booking_status_enum AS ENUM ('booked', 'checked_in', 'checked_out', 'cancelled');
      CREATE TYPE payment_method_enum AS ENUM ('Visa', 'MasterCard', 'AmericanExpress', 'PayPal');
      CREATE TYPE deal_status_enum AS ENUM ('Ongoing', 'Finished');
      CREATE TYPE room_level_name_enum AS ENUM ('Vip', 'Luxury', 'Standard');
      CREATE TYPE user_status_enum AS ENUM ('active', 'blocked');
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS gender_enum CASCADE;
      DROP TYPE IF EXISTS role_enum CASCADE;
      DROP TYPE IF EXISTS room_type_name_enum CASCADE;
      DROP TYPE IF EXISTS room_status_enum CASCADE;
      DROP TYPE IF EXISTS booking_status_enum CASCADE;
      DROP TYPE IF EXISTS payment_method_enum CASCADE;
      DROP TYPE IF EXISTS deal_status_enum CASCADE;
      DROP TYPE IF EXISTS room_level_name_enum CASCADE;
      DROP TYPE IF EXISTS user_status_enum CASCADE;
    `);
  }
};
