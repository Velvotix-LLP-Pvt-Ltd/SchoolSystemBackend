const express = require("express");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());

// user routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Home");
});

app.use(errorHandler);

module.exports = app;
