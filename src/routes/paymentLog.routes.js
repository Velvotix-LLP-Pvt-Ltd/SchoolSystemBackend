const express = require("express");
const router = express.Router();

const {
  getPaymentLogsByStudentAndYear,
  addManualFeeToLog,
} = require("../controllers/paymentLog.controller");

// Get payment logs for a student for a specific academic year
router.get("/:studentId/year/:academicYear", getPaymentLogsByStudentAndYear);

// Add a manual fee to a student's log for a specific month and year
router.post("/:studentId/:month/:year/manual-fee", addManualFeeToLog);

module.exports = router;
