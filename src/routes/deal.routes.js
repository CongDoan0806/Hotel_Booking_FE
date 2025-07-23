const express = require("express");
const router = express.Router();
const dealController = require("../controllers/deal.controller");

router.get("/active", dealController.getAllActiveDeals);
router.get("/deals", dealController.getAllDeals);
router.get("/deals/room_type/:id", dealController.getDealByRoomTypeController);
router.get("/deals/:id", dealController.getDealByIdController);
router.get("/deals/status/:status", dealController.getDealsByStatusController);
router.post("/deals", dealController.createDeal);
router.put("/deals/:id", dealController.updateDeal);
router.delete("/deals/:id", dealController.deleteDeal);
router.get("/deals/summary", dealController.getDealSummaryController);

module.exports = router;