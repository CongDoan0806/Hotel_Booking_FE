const { body, validationResult } = require("express-validator");

const validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  handleValidationErrors,
];

const validateRoom = [
  body("name")
    .notEmpty()
    .withMessage("Room name is required")
    .isLength({ max: 100 })
    .withMessage("Room name must be less than 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isDecimal()
    .withMessage("Price must be a decimal number"),

  body("status")
    .optional()
    .isIn(["available", "booked", "maintenance"])
    .withMessage("Invalid status"),

  body("room_type_id")
    .notEmpty()
    .withMessage("room_type_id is required")
    .isInt({ min: 1 })
    .withMessage("room_type_id must be a positive integer"),

  body("room_level_id")
    .notEmpty()
    .withMessage("room_level_id is required")
    .isInt({ min: 1 })
    .withMessage("room_level_id must be a positive integer"),

  body("floor_id")
    .notEmpty()
    .withMessage("floor_id is required")
    .isInt({ min: 1 })
    .withMessage("floor_id must be a positive integer"),

  handleValidationErrors,
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
}

module.exports = {
  validateCreateUser,
  validateRoom,
};
