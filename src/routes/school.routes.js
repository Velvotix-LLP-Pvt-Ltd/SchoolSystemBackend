const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/school.controller");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");

// Create a new school
router.post("/", protect, allowRoles("Admin"), schoolController.createSchool);

// Get all schools
router.get("/", protect, allowRoles("Admin"), schoolController.getAllSchools);

// Get a single school by ID
router.get(
  "/:id",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  schoolController.getSchoolById
);

// Update a school by ID
router.put(
  "/:id",
  protect,
  allowRoles("Admin", "School"),
  schoolController.updateSchool
);

// Delete a school by ID
router.delete(
  "/:id",
  protect,
  allowRoles("Admin"),
  schoolController.deleteSchool
);

module.exports = router;
