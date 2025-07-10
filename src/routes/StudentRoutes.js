const express = require("express");
const router = express.Router();
const studentController = require("../controllers/StudentController");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");

router.post(
  "/",
  protect,
  studentController.createStudent,
  allowRoles("Admin", "School", "Teacher")
);
router.get(
  "/school/:school_code",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  studentController.getStudentsBySchool
);
router.get(
  "/",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  studentController.getStudents
);
router.get(
  "/:id",
  protect,
  allowRoles("Admin", "School", "Teacher", "Student"),
  studentController.getStudent
);
router.put(
  "/:id",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  studentController.updateStudent
);
router.delete(
  "/:id",
  protect,
  allowRoles("Admin", "School", "Teacher"),
  studentController.deleteStudent
);

module.exports = router;
