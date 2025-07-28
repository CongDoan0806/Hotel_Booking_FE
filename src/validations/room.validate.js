const { body, param, validationResult } = require("express-validator");

const validateRoom = [
  body("name").notEmpty().withMessage("Room name is required"),
  body("room_type_id").isInt().withMessage("room_type_id must be an integer"),
  body("room_level_id").isInt().withMessage("room_level_id must be an integer"),
  body("floor_id").isInt().withMessage("floor_id must be an integer"),
  body("status")
    .isIn(["available", "booked", "maintenance"])
    .withMessage("Invalid status"),
  body("description").optional().isString(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateRoomId = [
  param("id").isInt().withMessage("Room ID must be an integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Room ID",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = { validateRoom, validateRoomId };
