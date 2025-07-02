const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandle");
const roomRoutes = require("./routes/room.routes");
const app = express();
const path = require("path");

const userRoutes = require("./routes/user.routes");

// Serve ảnh trong public/uploads qua đường dẫn /uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads/rooms"))
);

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use("/api/room", roomRoutes);
app.use("/api", userRoutes);

module.exports = app;
