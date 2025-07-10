const Attendance = require("../models/AttendanceModel");
const Student = require("../models/StudentModel");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const attendance = new Attendance({
      school: req.user.schoolId,
      student: studentId,
      date: new Date(date),
      status,
      remarks,
      recordedBy: req.user.id,
      recordedByModel: req.user.role,
    });

    await attendance.save();

    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Attendance already exists for this student on this date",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get Attendance for a Student
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const records = await Attendance.find({ student: studentId }).sort({
      date: -1,
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attendance records (no filters)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      //   .populate("student", "name class section studentId")
      //   .populate("school", "school_name school_code")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Attendance by Date (e.g., for a class)
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const schoolId = req.user.schoolId;

    const records = await Attendance.find({
      school: schoolId,
      date: new Date(date),
    }).populate("student", "name class section studentId");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const updated = await Attendance.findByIdAndUpdate(attendanceId, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Attendance not found" });

    res.json({ message: "Attendance updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const deleted = await Attendance.findByIdAndDelete(attendanceId);
    if (!deleted)
      return res.status(404).json({ error: "Attendance not found" });

    res.json({ message: "Attendance deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
