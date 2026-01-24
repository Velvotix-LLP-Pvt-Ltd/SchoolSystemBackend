const express = require("express");
const path = require("path");
const cors = require("cors");

// Route Imports
const userRoutes = require("./routes/user.routes");
const schoolRoutes = require("./routes/school.routes");
const authRoutes = require("./routes/AuthRoutes");
const teacherRoutes = require("./routes/TeacherRoute");
const studentRoutes = require("./routes/StudentRoutes");
const attendanceRoutes = require("./routes/AttendanceRoute");
const feeRoutes = require("./routes/FeeRoutes");
const paymentStructureRoutes = require("./routes/paymentStructure.routes");
const paymentLogRoutes = require("./routes/paymentLog.routes");
const BCToken = require("./routes/BusinessCentral");

// Middlewares & Utilities
const errorHandler = require("./middlewares/error.middleware");
const { startMonthlyPaymentLogCron } = require("./services/cronJobs");

// Initialize cron job
startMonthlyPaymentLogCron();

// Create app instance
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mounts
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fee", feeRoutes);
app.use("/api/payment-structures", paymentStructureRoutes);
app.use("/api/payment-logs", paymentLogRoutes);
app.use("/api/bc", BCToken);

// Static files
app.use("/utils/users", express.static(path.join(__dirname, "utils/users")));

// Default home route
app.get("/", (req, res) => {
  res.send("School Management API is running...");
});

// Global error handler
app.use(errorHandler);

module.exports = app;
