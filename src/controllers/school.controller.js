const School = require("../models/school.model"); 

// Create a new school
exports.createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.status(201).json({ message: "School created successfully", school });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all schools
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single school by ID
exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }
    res.status(200).json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a school by ID
exports.updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }
    res.status(200).json({ message: "School updated", school });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a school by ID
exports.deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }
    res.status(200).json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
