const pool = require('../config/db');
const Payment = require('../models/payment.model');

const createPayment = async (paymentData) => {
  return await Payment.create(paymentData); 
};

module.exports = {
  createPayment,
};
