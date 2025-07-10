const express = require("express");
const userRoutes = require("./routes/user.routes");
const schoolRoutes = require("./routes/school.routes");
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user routes
app.use("/api/users", userRoutes);
// school routes
app.use("/api/schools", schoolRoutes);

app.use("/utils/users", express.static(path.join(__dirname, "utils/users")));

app.get("/", (req, res) => {
  res.send("Home");
});

app.use(errorHandler);

module.exports = app;
