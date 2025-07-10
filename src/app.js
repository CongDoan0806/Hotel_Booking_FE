const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandle");
const app = express();

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const floorRoutes = require("./routes/floor.routes");
const amenityRoutes = require("./routes/amenity.routes");
// Serve ảnh trong public/uploads qua đường dẫn /uploads
app.use(
  "/uploads/rooms",
  express.static(path.join(__dirname, "public/uploads/rooms"))
);

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use("/api/rooms", roomRoutes);
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", floorRoutes);
app.use("/api", amenityRoutes);
module.exports = app;
