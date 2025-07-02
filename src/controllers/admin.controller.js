const RoomModel = require("../models/room.model");

const AdminController = {
  getAllRooms: async (req, res, next) => {
    try {
      const rooms = await RoomModel.getAllRooms();
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  },

  getRoomById: async (req, res, next) => {
    try {
      const room = await RoomModel.getRoomById(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  createRoom: async (req, res, next) => {
    try {
      const room = await RoomModel.createRoom(req.body);
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  },

  updateRoom: async (req, res, next) => {
    try {
      const room = await RoomModel.updateRoom(req.params.id, req.body);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  deleteRoom: async (req, res, next) => {
    try {
      const room = await RoomModel.deleteRoom(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json({ message: "Room deleted", room });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AdminController;
