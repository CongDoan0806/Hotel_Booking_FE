const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");

router.post("/profile/hotel-feedback", profileController.createHotelFeedbackController);

module.exports = router;