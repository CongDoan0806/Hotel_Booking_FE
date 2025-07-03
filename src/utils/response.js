const success = (
  res,
  data = null,
  message = "Success",
  status = data ? 200 : 204
) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

const error = (res, message = "Something went wrong", status = 500) => {
  return res.status(status).json({
    status: "error",
    message,
  });
};

// 400 - Bad Request

const badRequest = (res, message = "Bad Request") => {
  return error(res, message, 400);
};

// 401 - Unauthorized
const unauthorized = (res, message = "Unauthorized") => {
  return error(res, message, 401);
};

// 403 - Forbidden
const forbidden = (res, message = "Forbidden") => {
  return error(res, message, 403);
};

// 404 - Not Found
const notFound = (res, message = "Not Found") => {
  return error(res, message, 404);
};

// 409 - Conflict
const conflict = (res, message = "Conflict") => {
  return error(res, message, 409);
};

// 422 - Unprocessable Entity (Validation Error)
const unprocessableEntity = (res, message = "Validation failed") => {
  return error(res, message, 422);
};

// 429 - Too Many Requests
const tooManyRequests = (res, message = "Too many requests") => {
  return error(res, message, 429);
};

// 500 - Server Error
const serverError = (res, message = "Internal Server Error") => {
  return error(res, message, 500);
};

module.exports = {
  success,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessableEntity,
  tooManyRequests,
  serverError,
};
