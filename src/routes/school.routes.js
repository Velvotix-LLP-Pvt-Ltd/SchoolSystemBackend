const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/school.controller");

// Create a new school
router.post("/", schoolController.createSchool);

// Get all schools
router.get("/", schoolController.getAllSchools);

// Get a single school by ID
router.get("/:id", schoolController.getSchoolById);

// Update a school by ID
router.put("/:id", schoolController.updateSchool);

// Delete a school by ID
router.delete("/:id", schoolController.deleteSchool);

module.exports = router;
