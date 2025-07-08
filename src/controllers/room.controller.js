const roomService = require('../services/room.service');

const roomController = {
  filterRooms: async (req, res) => {
    try {
      const filters = {
        min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
        room_type: req.query.room_type ? parseInt(req.query.room_type) : undefined,
        people: req.query.people ? parseInt(req.query.people) : undefined,
        check_in_date: req.query.check_in_date || undefined,
        check_out_date: req.query.check_out_date || undefined,
      };

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
};

module.exports = roomController;