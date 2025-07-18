const express = require("express");
const router = express.Router();
const feeController = require("../controllers/FeePaymentController");
const { protect, allowRoles } = require("../middlewares/AuthMiddlerware");
const generateFeeLogs = require("../services/generateFeeLogs");

router.use(protect);
router.use(allowRoles("School", "Teacher", "Admin"));

// Fee Structure APIs
router.post("/structure", feeController.createFeeStructure);

router.get("/fee-structure", feeController.getFeeStructure);

// Fee Payment
router.post("/pay", feeController.payFee);

// Get Logs & Payments
router.get("/logs/:studentId", feeController.getFeeLogs);
router.get("/payments/:studentId", feeController.getPayments);

// Monthly Fee Generation
router.post("/generate-monthly-fees", async (req, res) => {
  try {
    await generateFeeLogs.generateMonthlyFeeLogs();
    res.json({ message: "Monthly fee logs generated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add Custom (One-Time) Fee
router.post("/custom", feeController.addCustomFeeLog);

module.exports = router;
