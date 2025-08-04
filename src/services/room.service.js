const roomRepository = require("../repositories/room.repository");
const dealService = require("./deal.service");

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
  getAllRooms: async (page, perPage) => {
    return await roomRepository.getAll(page, perPage);
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
  getFilterOptions: async () => {
    try {
      const filterOptions = await roomRepository.getFilterOptions();
      return filterOptions;
    } catch (error) {
      throw new Error(`Failed to get filter options: ${error.message}`);
    }
  },
};

module.exports = roomService;
