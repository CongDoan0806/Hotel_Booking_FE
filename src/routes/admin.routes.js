const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const {
  validateRoom,
  validateRoomId,
} = require("../validations/room.validate");
const { authenticateToken } = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/role");

router.use(authenticateToken, adminOnly);

router.get("/", roomController.getAllRooms);
router.get("/:id", validateRoomId, roomController.getRoomById);
router.post("/", validateRoom, roomController.createRoom);
router.put("/:id", validateRoomId, validateRoom, roomController.updateRoom);
router.delete("/:id", validateRoomId, roomController.deleteRoom);

module.exports = router;
