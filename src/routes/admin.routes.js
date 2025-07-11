const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const {
  validateRoom,
  validateRoomId,
} = require("../validations/room.validate");
const { authenticateToken } = require("../middlewares/auth");
const { adminOnly } = require("../middlewares/role");
const upload = require("../utils/upload");
const { getUserListController,getCheckinGuestsController,getCheckoutGuestsController} = require("../controllers/admin.controller");
router.use(authenticateToken, adminOnly);

router.get("/admin/rooms/", roomController.getAllRooms);
router.get("/admin/rooms/:id", validateRoomId, roomController.getRoomById);
router.post(
  "/admin/rooms/",
  validateRoom,
  upload.multiImages,
  roomController.createRoom
);
router.put(
  "/admin/rooms/:id",
  validateRoomId,
  validateRoom,
  upload.multiImages,
  roomController.updateRoom
);
router.delete("/admin/rooms/:id", validateRoomId, roomController.deleteRoom);

router.get("/admin/user-list", getUserListController);

router.get("/admin/checkin-guests", getCheckinGuestsController);

router.get("/admin/checkout-guests", getCheckoutGuestsController);

module.exports = router;
