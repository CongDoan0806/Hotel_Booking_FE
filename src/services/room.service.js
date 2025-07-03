const roomRepository = require('../repositories/room.repository');

const roomService = {
  getFilteredRooms: async (filters) => {
    const rooms = await roomRepository.getFilteredRooms(filters);
    return rooms;
  },

  findRoomById: async (id) => {
    return await roomRepository.findRoomById(id);
  },

  createRoom: async (roomData) => {
    return await roomRepository.createRoom(roomData);
  },
};

module.exports = roomService;