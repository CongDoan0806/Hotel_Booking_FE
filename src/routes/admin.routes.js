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
const {getUserListController} = require('../controllers/admin.controller')
router.use(authenticateToken, adminOnly);

router.get("/", roomController.getAllRooms);
router.get("/:id", validateRoomId, roomController.getRoomById);
router.post("/", validateRoom, upload.multiImages, roomController.createRoom);
router.put(
  "/:id",
  validateRoomId,
  validateRoom,
  upload.multiImages,
  roomController.updateRoom
);
router.delete("/:id", validateRoomId, roomController.deleteRoom);

router.get('/admin/user-list', getUserListController)

module.exports = router;
