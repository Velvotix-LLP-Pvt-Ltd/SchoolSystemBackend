const bcrypt = require("bcryptjs");
const School = require("../models/school.model");

// Create a new school
exports.createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();

    const schoolObj = school.toObject();
    delete schoolObj.password;

    res
      .status(201)
      .json({ message: "School created successfully", school: schoolObj });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all schools (without passwords)
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select("-password");
    res.status(200).json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single school by ID
exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).select("-password");
    if (!school) return res.status(404).json({ error: "School not found" });

    res.status(200).json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a school by ID
exports.updateSchool = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const school = await School.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!school) return res.status(404).json({ error: "School not found" });

    const schoolObj = school.toObject();
    delete schoolObj.password;

    res.status(200).json({ message: "School updated", school: schoolObj });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a school by ID
exports.deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ error: "School not found" });

    res.status(200).json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
