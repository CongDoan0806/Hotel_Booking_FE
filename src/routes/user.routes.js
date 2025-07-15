const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get("/users/:id",authenticate, userController.getUser);

router.put("/users/:id",authenticate, userController.updateUser);

module.exports = router;