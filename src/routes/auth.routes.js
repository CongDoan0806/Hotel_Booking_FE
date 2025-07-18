const express = require('express');
const router = express.Router();
const {login, register, resetPassword,requestEmailChange,verifyEmailChange,changePassword,logout} = require('../controllers/auth.controller');
const { refreshTokenController } = require("../controllers/refreshtoken.controller");
const authenticateToken = require('../middlewares/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', logout);

module.exports = router;
router.post('/reset-password', resetPassword);
router.post('/request-email-change', authenticateToken, requestEmailChange);
router.post('/verify-email-change', authenticateToken, verifyEmailChange);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;    
