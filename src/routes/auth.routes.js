const express = require('express');
const router = express.Router();
const {login, register, resetPassword, logout} = require('../controllers/auth.controller');
const { refreshTokenController } = require("../controllers/refreshtoken.controller");



router.post('/register', register);
router.post('/login', login)
router.post('/refresh-token', refreshTokenController);
router.post('/reset-password', resetPassword )
router.post('/logout', logout);

module.exports = router;