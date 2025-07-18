const express = require("express");
const router = express.Router();
const dealController = require("../controllers/deal.controller");

router.get("/active", dealController.getAllActiveDeals);
router.get("/deals", dealController.getAllDeals)
router.post("/deals", dealController.createDeal);
router.put("/deals/:id", dealController.updateDeal);
router.delete("/deals/:id", dealController.deleteDeal);

module.exports = router;
