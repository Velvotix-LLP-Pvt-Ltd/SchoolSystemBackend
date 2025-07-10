const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/TeacherController");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");

// Routes
router.post(
  "/",
  protect,
  allowRoles("Admin", "School"),
  teacherController.createTeacher
);
router.get(
  "/",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  teacherController.getTeachers
);
router.get(
  "/:id",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  teacherController.getTeacherById
);
router.put(
  "/:id",
  protect,
  allowRoles("Admin", "School"),
  teacherController.updateTeacher
);
router.delete(
  "/:id",
  allowRoles("Admin", "School"),
  protect,
  teacherController.deleteTeacher
);

module.exports = router;
