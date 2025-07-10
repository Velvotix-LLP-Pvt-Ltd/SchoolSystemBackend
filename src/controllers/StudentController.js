const Student = require("../models/StudentModel");
const School = require("../models/school.model");

// 🔄 Internal helper to update school's enrollment summary
const updateEnrollmentSummaryInController = async (schoolId) => {
  try {
    const students = await Student.find({ school: schoolId });

    const summary = {
      total_students: students.length,
      boys: students.filter((s) => s.gender === "Male").length,
      girls: students.filter((s) => s.gender === "Female").length,
      cwsn: students.filter((s) => s.cwsn === true).length,
    };

    await School.findByIdAndUpdate(schoolId, {
      enrollment_summary: summary,
    });
  } catch (err) {
    console.error("Error updating enrollment summary:", err.message);
  }
};

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { school_code, ...studentData } = req.body;

    const school = await School.findOne({ school_code });
    if (!school) {
      return res.status(400).json({ error: "Invalid school code" });
    }

    const student = new Student({
      ...studentData,
      school: school._id,
    });

    await student.save();

    // 🔄 Update school enrollment summary
    await updateEnrollmentSummaryInController(school._id);

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Students for a School
exports.getStudentsBySchool = async (req, res) => {
  try {
    const school = await School.findOne({
      school_code: req.params.school_code,
    });
    if (!school) return res.status(404).json({ error: "School not found" });

    const students = await Student.find({ school: school._id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("school");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // 🔄 Optionally update enrollment summary if gender/status changed
    await updateEnrollmentSummaryInController(student.school);

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // 🔄 Update enrollment after deletion
    await updateEnrollmentSummaryInController(student.school);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Students (optionally filter by school)
exports.getStudents = async (req, res) => {
  try {
    const filter = req.query.school ? { school: req.query.school } : {};
    const students = await Student.find(filter).populate("school");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
