const roomRepository = require("../repositories/room.repository");

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
  getAllRooms: async () => {
    return await roomRepository.getAll();
  },

  getRoomById: async (id) => {
    const room = await roomRepository.getById(id);
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  },

  updateRoom: async (id, roomData) => {
    const updatedRoom = await roomRepository.update(id, roomData);
    if (!updatedRoom) {
      throw new Error("Failed to update. Room not found.");
    }
    return updatedRoom;
  },

  deleteRoom: async (id) => {
    const deletedRoom = await roomRepository.remove(id);
    if (!deletedRoom) {
      throw new Error("Failed to delete. Room not found.");
    }
    return deletedRoom;
  },
};

module.exports = roomService;
