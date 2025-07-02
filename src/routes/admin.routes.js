const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");
const { validateRoom } = require("../middlewares/validate");

router.get("/", AdminController.getAllRooms);
router.get("/:id", AdminController.getRoomById);
router.post("/", validateRoom, AdminController.createRoom);
router.put("/:id", validateRoom, AdminController.updateRoom);
router.delete("/:id", AdminController.deleteRoom);

module.exports = router;
