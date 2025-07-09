const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middlewares/auth');
const validateParams = require('../middlewares/validateParams');
const { bookingIdParamSchema } = require('../validations/booking.validate');


router.post('/bookings', authenticate, bookingController.createBooking);
router.get('/bookings/:booking_id/details', authenticate, validateParams(bookingIdParamSchema), bookingController.getBookingDetailController);
router.patch('/bookings/:booking_id/confirm', authenticate, validateParams(bookingIdParamSchema),bookingController.confirmBookingController);



module.exports = router;
