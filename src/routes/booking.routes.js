const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middlewares/auth'); // middleware xác thực JWT nếu có

router.post('/bookings',bookingController.createBooking);

router.get('/bookings/:id',authenticate, bookingController.getBookingDetail);



module.exports = router;
