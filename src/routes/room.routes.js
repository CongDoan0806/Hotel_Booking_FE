const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
router.get("/", roomController.getAllRooms);
router.get("/filter", roomController.filterRooms);
router.get("/:id", roomController.getRoomDetail);

module.exports = router;
