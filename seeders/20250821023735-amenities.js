"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("amenities", [
      { name: "Free Wi-Fi", icon: "/uploads/amenities/wifi.png", created_at: new Date() },
      { name: "Breakfast Included", icon: "/uploads/amenities/tea.png", created_at: new Date() },
      { name: "Pets are Welcome", icon: "/uploads/amenities/pet.png", created_at: new Date() },
      { name: "Free Parking", icon: "/uploads/amenities/parking.png", created_at: new Date() },
      { name: "Free Laundry Service", icon: "/uploads/amenities/clothes-crew-neck.png", created_at: new Date() },
      { name: "Free Entrance Exercise Centre", icon: "/uploads/amenities/sport.png", created_at: new Date() },
      { name: "Swimming Pool", icon: "/uploads/amenities/pool.png", created_at: new Date() },
      { name: "Air Conditioning", icon: "/uploads/amenities/air-conditioning.png", created_at: new Date() },
      { name: "TV", icon: "/uploads/amenities/tv.png", created_at: new Date() },
      { name: "Mini Bar", icon: "/uploads/amenities/minibar.png", created_at: new Date() },
      { name: "24h Room Service", icon: "/uploads/amenities/room-service.png", created_at: new Date() },
      { name: "Spa & Wellness", icon: "/uploads/amenities/spa.png", created_at: new Date() },
      { name: "Gym", icon: "/uploads/amenities/gym.png", created_at: new Date() },
      { name: "Airport Shuttle", icon: "/uploads/amenities/shuttle.png", created_at: new Date() },
      { name: "Conference Room", icon: "/uploads/amenities/conference.png", created_at: new Date() },
      { name: "Restaurant", icon: "/uploads/amenities/restaurant.png", created_at: new Date() },
      { name: "Bar", icon: "/uploads/amenities/bar.png", created_at: new Date() },
      { name: "Non-smoking Rooms", icon: "/uploads/amenities/non-smoking.png", created_at: new Date() },
      { name: "Sea View", icon: "/uploads/amenities/sea-view.png", created_at: new Date() },
      { name: "Balcony", icon: "/uploads/amenities/balcony.png", created_at: new Date() },
      { name: "Sauna", icon: "/uploads/amenities/sauna.png", created_at: new Date() },
      { name: "Jacuzzi", icon: "/uploads/amenities/jacuzzi.png", created_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("amenities", null, {});
  },
};
