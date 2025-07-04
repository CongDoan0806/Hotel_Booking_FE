const roomService = require('../services/room.service');

const roomController = {
  filterRooms: async (req, res) => {
    try {
      const filters = req.query;
      const rooms = await roomService.getFilteredRooms(filters);
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  createRoom: async (req, res) => {
    try {
      const roomData = req.body;
      const newRoom = await roomService.createRoom(roomData);
      return res.status(201).json(newRoom);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
   getRoomDetail: async (req, res, next) => {
  try {
    const roomId = Number(req.params.id);
    const room   = await roomService.getRoomDetail(roomId);
    res.json(room);
  } catch (err) {
    if (err.message === "ROOM_NOT_FOUND")
      return res.status(404).json({ message: "Room not found" });
    next(err);                      // middleware error handler
  }
},
};

module.exports = roomController;