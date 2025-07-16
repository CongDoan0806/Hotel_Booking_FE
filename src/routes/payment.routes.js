const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middlewares/auth');
const validateParams = require('../middlewares/validateParams');

router.post('/payment/success', authenticate, paymentController.handlePaymentSuccess);

module.exports = router;
