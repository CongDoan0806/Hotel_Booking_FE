const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { validateRoom } = require("../middlewares/validate");

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", validateRoom, roomController.createRoom);
router.put("/:id", validateRoom, roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
