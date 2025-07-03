const roomService = require("../services/room.service");
const response = require("../utils/response");

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms();
    return response.success(res, rooms, "Fetched all rooms");
  } catch (err) {
    return response.serverError(res, err.message);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return response.notFound(res, "Room not found");
    return response.success(res, room, "Room found");
  } catch (err) {
    return response.serverError(res, err.message);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    return response.success(res, newRoom, "Room created", 201);
  } catch (err) {
    return response.badRequest(res, err.message);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const updated = await roomService.updateRoom(req.params.id, req.body);
    if (!updated) return response.notFound(res, "Room not found");
    return response.success(res, updated, "Room updated");
  } catch (err) {
    return response.badRequest(res, err.message);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const deleted = await roomService.deleteRoom(req.params.id);
    if (!deleted) return response.notFound(res, "Room not found");
    return response.success(res, null, "Room deleted successfully", 200);
  } catch (err) {
    return response.serverError(res, err.message);
  }
};
