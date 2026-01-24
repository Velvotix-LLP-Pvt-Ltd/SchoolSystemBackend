const PaymentLog = require("../models/PaymentLog.Model.js");
const PaymentStructure = "../models/paymentStructure.model.js";
const Student = require("../models/StudentModel.js");

// Get all logs for one student for one academic year
exports.getPaymentLogsByStudentAndYear = async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const logs = await PaymentLog.find({
      student: student._id,
      academicYear,
    }).sort({ year: 1, month: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs", error });
  }
};

// Add manual fee to an existing log
exports.addManualFeeToLog = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;
    const { title, amount } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const log = await PaymentLog.findOne({ student: student._id, month, year });
    if (!log) return res.status(404).json({ message: "Payment log not found" });

    log.expected.additionalCharges.push({ title, amount, isManual: true });
    log.totalDue += amount;
    log.balance += amount;
    await log.save();

    res.json({ message: "Manual fee added", log });
  } catch (error) {
    res.status(500).json({ message: "Failed to add manual fee", error });
  }
};
