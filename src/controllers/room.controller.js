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
      const filters = {
        min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
        room_type: req.query.room_type ? parseInt(req.query.room_type) : undefined,
        people: req.query.people ? parseInt(req.query.people) : undefined,
        check_in_date: req.query.check_in_date || undefined,
        check_out_date: req.query.check_out_date || undefined,
        amenities: req.query.amenities || undefined,
      };

      const rooms = await roomService.getFilteredRooms(filters);

      const hasDeals = rooms.some(room => room.deal !== null);

      return response.success(res, { rooms, hasDeals }, "Filtered rooms");
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
