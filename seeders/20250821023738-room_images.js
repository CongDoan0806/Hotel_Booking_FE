'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('room_images', [
      // Room 1
      { room_id: 1, image_url: '/uploads/rooms/room_1.1.jpg'},
      { room_id: 1, image_url: '/uploads/rooms/room_1.2.jpg'},
      { room_id: 1, image_url: '/uploads/rooms/room_1.3.jpg'},
      { room_id: 1, image_url: '/uploads/rooms/room_1.4.jpg'},
      { room_id: 1, image_url: '/uploads/rooms/room_1.5.jpg'},

      // Room 2
      { room_id: 2, image_url: '/uploads/rooms/room_2.1.jpg'},
      { room_id: 2, image_url: '/uploads/rooms/room_2.2.jpg'},
      { room_id: 2, image_url: '/uploads/rooms/room_2.3.jpg'},
      { room_id: 2, image_url: '/uploads/rooms/room_2.4.jpg'},
      { room_id: 2, image_url: '/uploads/rooms/room_2.5.jpg'},

      // Room 3
      { room_id: 3, image_url: '/uploads/rooms/room_3.1.jpg'},
      { room_id: 3, image_url: '/uploads/rooms/room_3.2.jpg'},
      { room_id: 3, image_url: '/uploads/rooms/room_3.3.jpg'},
      { room_id: 3, image_url: '/uploads/rooms/room_3.4.jpg'},
      { room_id: 3, image_url: '/uploads/rooms/room_3.5.jpg'},

      // Room 4
      { room_id: 4, image_url: '/uploads/rooms/room_4.1.jpg'},
      { room_id: 4, image_url: '/uploads/rooms/room_4.2.jpg'},
      { room_id: 4, image_url: '/uploads/rooms/room_4.3.jpg'},
      { room_id: 4, image_url: '/uploads/rooms/room_4.4.jpg'},
      { room_id: 4, image_url: '/uploads/rooms/room_4.5.jpg'},

      // Room 5
      { room_id: 5, image_url: '/uploads/rooms/room_5.1.jpg'},
      { room_id: 5, image_url: '/uploads/rooms/room_5.2.jpg'},
      { room_id: 5, image_url: '/uploads/rooms/room_5.3.jpg'},
      { room_id: 5, image_url: '/uploads/rooms/room_5.4.jpg'},
      { room_id: 5, image_url: '/uploads/rooms/room_5.5.jpg'},

      // Room 6
      { room_id: 6, image_url: '/uploads/rooms/room_6.1.jpg'},
      { room_id: 6, image_url: '/uploads/rooms/room_6.2.jpg'},
      { room_id: 6, image_url: '/uploads/rooms/room_6.3.jpg'},
      { room_id: 6, image_url: '/uploads/rooms/room_6.4.jpg'},
      { room_id: 6, image_url: '/uploads/rooms/room_6.5.jpg'},

      // Room 7
      { room_id: 7, image_url: '/uploads/rooms/room_7.1.jpg'},
      { room_id: 7, image_url: '/uploads/rooms/room_7.2.jpg'},
      { room_id: 7, image_url: '/uploads/rooms/room_7.3.jpg'},
      { room_id: 7, image_url: '/uploads/rooms/room_7.4.jpg'},

      // Room 8
      { room_id: 8, image_url: '/uploads/rooms/room_8.1.jpg'},
      { room_id: 8, image_url: '/uploads/rooms/room_8.2.jpg'},

      // Room 9
      { room_id: 9, image_url: '/uploads/rooms/room_9.1.jpg'},
      { room_id: 9, image_url: '/uploads/rooms/room_9.2.jpg'},
      { room_id: 9, image_url: '/uploads/rooms/room_9.3.jpg'},

      // Room 10
      { room_id: 10, image_url: '/uploads/rooms/room_10.1.jpg'},
      { room_id: 10, image_url: '/uploads/rooms/room_10.2.jpg'},

      // Room 11
      { room_id: 11, image_url: '/uploads/rooms/room_11.1.jpg'},

      // Room 12
      { room_id: 12, image_url: '/uploads/rooms/room_12.1.jpg'},

      // Room 13
      { room_id: 13, image_url: '/uploads/rooms/room_13.1.jpg'},

      // Room 14
      { room_id: 14, image_url: '/uploads/rooms/room_14.1.jpg'},

      // Room 15
      { room_id: 15, image_url: '/uploads/rooms/room_15.1.jpg'},
      { room_id: 15, image_url: '/uploads/rooms/room_15.2.jpg'},
      { room_id: 15, image_url: '/uploads/rooms/room_15.3.jpg'},
      { room_id: 15, image_url: '/uploads/rooms/room_15.4.jpg'},
      { room_id: 15, image_url: '/uploads/rooms/room_15.5.jpg'},
      { room_id: 15, image_url: '/uploads/rooms/room_15.6.jpg'},

      // Room 16
      { room_id: 16, image_url: '/uploads/rooms/room_16.1.jpg'},
      { room_id: 16, image_url: '/uploads/rooms/room_16.2.jpg'},
      { room_id: 16, image_url: '/uploads/rooms/room_16.3.jpg'},

      // Room 17
      { room_id: 17, image_url: '/uploads/rooms/room_17.1.jpg'},
      { room_id: 17, image_url: '/uploads/rooms/room_17.2.jpg'},
      { room_id: 17, image_url: '/uploads/rooms/room_17.3.jpg'},
      { room_id: 17, image_url: '/uploads/rooms/room_17.4.jpg'},
      { room_id: 17, image_url: '/uploads/rooms/room_17.5.jpg'},

      // Room 18
      { room_id: 18, image_url: '/uploads/rooms/room_18.1.jpg'},
      { room_id: 18, image_url: '/uploads/rooms/room_18.2.jpg'},
      { room_id: 18, image_url: '/uploads/rooms/room_18.3.jpg'},
      { room_id: 18, image_url: '/uploads/rooms/room_18.4.jpg'},
      { room_id: 18, image_url: '/uploads/rooms/room_18.5.jpg'},

      // Room 19
      { room_id: 19, image_url: '/uploads/rooms/room_19.1.jpg'},
      { room_id: 19, image_url: '/uploads/rooms/room_19.2.jpg'},
      { room_id: 19, image_url: '/uploads/rooms/room_19.3.jpg'},
      { room_id: 19, image_url: '/uploads/rooms/room_19.4.jpg'},

      // Room 20
      { room_id: 20, image_url: '/uploads/rooms/room_20.1.jpg'},
      { room_id: 20, image_url: '/uploads/rooms/room_20.2.jpg'},
      { room_id: 20, image_url: '/uploads/rooms/room_20.3.jpg'},
      { room_id: 20, image_url: '/uploads/rooms/room_20.4.jpg'},
      { room_id: 20, image_url: '/uploads/rooms/room_20.5.jpg'},

      // Room 21
      { room_id: 21, image_url: '/uploads/rooms/room_21.1.jpg'},
      { room_id: 21, image_url: '/uploads/rooms/room_21.2.jpg'},
      { room_id: 21, image_url: '/uploads/rooms/room_21.3.jpg'},
      { room_id: 21, image_url: '/uploads/rooms/room_21.4.jpg'},

      // Room 22
      { room_id: 22, image_url: '/uploads/rooms/room_22.1.jpg'},
      { room_id: 22, image_url: '/uploads/rooms/room_22.2.jpg'},
      { room_id: 22, image_url: '/uploads/rooms/room_22.3.jpg'},
      { room_id: 22, image_url: '/uploads/rooms/room_22.4.jpg'},
      { room_id: 22, image_url: '/uploads/rooms/room_22.5.jpg'}
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('room_images', null, {});
  }
};
