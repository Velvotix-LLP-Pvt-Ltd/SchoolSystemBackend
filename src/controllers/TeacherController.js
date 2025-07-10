const Teacher = require("../models/TeachersModel");
const School = require("../models/school.model");

// Utility function to update teacher count in school
const updateTeacherSummary = async (schoolId) => {
  const total = await Teacher.countDocuments({ school: schoolId });
  const male = await Teacher.countDocuments({
    school: schoolId,
    gender: "Male",
  });
  const female = await Teacher.countDocuments({
    school: schoolId,
    gender: "Female",
  });
  const trained = await Teacher.countDocuments({
    school: schoolId,
    trained: true,
  });

  await School.findByIdAndUpdate(schoolId, {
    $set: {
      "staff_summary.total_teachers": total,
      "staff_summary.male_teachers": male,
      "staff_summary.female_teachers": female,
      "staff_summary.trained_teachers": trained,
    },
    $currentDate: { last_updated: true },
  });
};

// Create Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { school_code, ...teacherData } = req.body;

    // Find School by school_code
    const school = await School.findOne({ school_code });
    if (!school) {
      return res.status(400).json({ error: "Invalid school code" });
    }

    const teacher = new Teacher({
      ...teacherData,
      school: school._id,
    });

    await teacher.save();

    await updateTeacherSummary(school._id);

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Teachers (optionally filter by school)
exports.getTeachers = async (req, res) => {
  try {
    const filter = req.query.school ? { school: req.query.school } : {};
    const teachers = await Teacher.find(filter).populate("school");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("school");
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    await updateTeacherSummary(teacher.school);

    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    await updateTeacherSummary(teacher.school);

    res.json({ message: "Teacher deleted and summary updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Teachers for a School
exports.getTeachersBySchool = async (req, res) => {
  try {
    const school = await School.findOne({
      school_code: req.params.school_code,
    });
    if (!school) return res.status(404).json({ error: "School not found" });

    const teachers = await Teacher.find({ school: school._id });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
