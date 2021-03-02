const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const keys = require("./config/keys.config");

const authRoutes = require("./routes/auth.route");
const analyticsRoutes = require("./routes/analytics.route");
const orderRoutes = require("./routes/order.route");
const positionRoutes = require("./routes/position.route");
const categoryRoutes = require("./routes/category.route");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB has been connected"))
  .catch((err) => console.error(err));

app.use(passport.initialize());
require("./middleware/passport.middleware")(passport);

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/category", categoryRoutes);

module.exports = app;
