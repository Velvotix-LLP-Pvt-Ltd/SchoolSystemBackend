const Attendance = require("../models/AttendanceModel");
const Student = require("../models/StudentModel");
const School = require("../models/school.model");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    const created = [];

    for (const entry of data) {
      const { studentId, date, status, remarks, schoolId } = entry;

      const student = await Student.findById(studentId);
      const school = await School.findById(schoolId);
      if (!student || !school) continue; // skip if invalid

      const attendance = new Attendance({
        school: schoolId,
        student: studentId,
        date: new Date(date),
        status,
        remarks,
        recordedBy: req.user.id,
        recordedByModel: req.user.role,
      });

      try {
        await attendance.save();
        created.push(attendance);
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate (already marked for the date) – ignore or log
          continue;
        } else {
          throw err; // rethrow unexpected errors
        }
      }
    }

    if (created.length === 0) {
      return res.status(400).json({
        message:
          "No new attendance entries were created. Possible duplicates or invalid data.",
      });
    }

    res.status(201).json({
      message: `${created.length} attendance record(s) marked`,
      records: created,
    });
  } catch (err) {
    console.error(err);
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
    const { schoolId, studentId } = req.query;
    const filter = {};
    const student = await Student.find({ studentId: studentId });
    const school = await School.find({ school_code: schoolId });
    if (schoolId) filter.school = school;
    if (studentId) filter.student = student;

    const records = await Attendance.find(filter).sort({ date: -1 });

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
