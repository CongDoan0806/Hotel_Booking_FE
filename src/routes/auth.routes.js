const express = require('express');
const router = express.Router();
const {login, register, resetPassword} = require('../controllers/auth.controller');
const { refreshTokenController } = require("../controllers/refreshtoken.controller");
const authenticateToken = require('../middlewares/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokenController);
router.post('/reset-password', resetPassword);


module.exports = router;    