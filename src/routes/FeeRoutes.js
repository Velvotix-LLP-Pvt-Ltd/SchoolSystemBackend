const express = require("express");
const router = express.Router();
const feeController = require("../controllers/FeePaymentController");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");
const generateFeeLogs = require("../services/generateFeeLogs");

router.use(protect);
router.use(allowRoles("School", "Teacher"));

router.post("/structure", feeController.createFeeStructure);
router.post("/pay", feeController.payFee);
router.get("/logs/:studentId", feeController.getFeeLogs);
router.get("/payments/:studentId", feeController.getPayments);

router.post("/generate-monthly-fees", async (req, res) => {
  try {
    await generateFeeLogs.generateMonthlyFeeLogs();
    res.json({ message: "Monthly fee logs generated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
