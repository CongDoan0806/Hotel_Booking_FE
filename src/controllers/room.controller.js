const roomService = require("../services/room.service");
const response = require("../utils/response");

const roomController = {
  getAllRooms: async (req, res, next) => {
    try {
      const rooms = await roomService.getAllRooms();
      return response.success(res, rooms, "Fetched all rooms");
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },

  getRoomById: async (req, res, next) => {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) return response.sendError(res, 404, "Room not found");
      return response.success(res, room, "Room found");
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const newRoom = await roomService.createRoom(req.body);
      return response.success(res, newRoom, "Room created", 201);
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const updated = await roomService.updateRoom(req.params.id, req.body);
      if (!updated) return response.sendError(res, 404, "Room not found");
      return response.success(res, updated, "Room updated");
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      const deleted = await roomService.deleteRoom(req.params.id);
      if (!deleted) return response.sendError(res, 404, "Room not found");
      return response.success(res, null, "Room deleted successfully", 200);
    } catch (err) {
      return response.sendError(res, 500, err.message);
    }
  },

  filterRooms: async (req, res, next) => {
    try {
      const filters = req.query;
      const rooms = await roomService.getFilteredRooms(filters);
      return response.success(res, rooms, "Filtered rooms");
    } catch (error) {
      return response.sendError(res, 500, error.message);
    }
  },
   getRoomDetail: async (req, res, next) => {
  try {
    const roomId = Number(req.params.id);
    const room = await roomService.getRoomDetail(roomId);

    if (!room) {
      return response.sendError(res, 404, "Room not found");
    }

    return response.success(res, room, "Room details fetched successfully");
  } catch (err) {
    return response.sendError(res, 500, err.message);
  }
},
};

module.exports = roomController;
