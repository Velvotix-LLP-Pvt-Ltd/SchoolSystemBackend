const express = require("express");
const userRoutes = require("./routes/user.routes");
const schoolRoutes = require("./routes/school.routes");
const AuthRoutes = require("./routes/AuthRoutes");
const TeacherRoutes = require("./routes/TeacherRoute");
const StudentRoutes = require("./routes/StudentRoutes");
const AttendanceRoute = require("./routes/AttendanceRoute");
const errorHandler = require("./middlewares/error.middleware");
const FeeRoutes = require("./routes/FeeRoutes");
const path = require("path");
const cors = require("cors");
const startCronJobs = require("./services/cronJobs");

startCronJobs();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api", AuthRoutes);
app.use("/api/teachers", TeacherRoutes);
app.use("/api/students", StudentRoutes);
app.use("/api/attendance", AttendanceRoute);
app.use("/api/fee", FeeRoutes);

app.use("/utils/users", express.static(path.join(__dirname, "utils/users")));

app.get("/", (req, res) => {
  res.send("Home");
});

app.use(errorHandler);

module.exports = app;
