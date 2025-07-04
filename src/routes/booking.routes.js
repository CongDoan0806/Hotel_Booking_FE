const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middlewares/auth'); // middleware xác thực JWT nếu có

router.post('/bookings', authenticate, bookingController.createBooking);



module.exports = router;
