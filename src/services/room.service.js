const roomRepository = require('../repositories/room.repository');

const roomService = {

    async getRoomDetail(id) {
    const room = await roomRepository.getRoomDetail(id);
    if (!room) throw new Error("ROOM_NOT_FOUND");
    return room;
  },
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