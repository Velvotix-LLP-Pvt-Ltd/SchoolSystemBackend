const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendanceController");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");

// All routes require Bearer Token
router.use(protect);
router.use(allowRoles("Admin", "School", "Teacher"));

// Mark attendance
router.post("/", attendanceController.markAttendance);

// All Records
router.get("/all", attendanceController.getAllAttendance);

// Get by student
router.get("/student/:studentId", attendanceController.getStudentAttendance);

// Get by date (for whole class/school)
router.get("/", attendanceController.getAttendanceByDate);

// ✏️ Update
router.put("/:id", attendanceController.updateAttendance);

// Delete
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
