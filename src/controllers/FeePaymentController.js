const FeeStructure = require("../models/FeeStructureModel");
const FeeLog = require("../models/FeeLogModel");
const FeePayment = require("../models/FeePaymentModel");
const Student = require("../models/StudentModel");
const School = require("../models/school.model");

// 1. Create/Update FeeStructure
exports.createFeeStructure = async (req, res) => {
  try {
    const {
      school,
      academicYear,
      class: className,
      monthlyFee,
      feeBreakup,
    } = req.body;

    const structure = await FeeStructure.findOneAndUpdate(
      { school, academicYear, class: className },
      { monthlyFee, feeBreakup },
      { upsert: true, new: true }
    );

    res.status(200).json(structure);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Pay fee for student
exports.payFee = async (req, res) => {
  try {
    const { studentId, amountPaid, mode, remarks } = req.body;

    // Find student by studentId (custom ID like "STU001")
    const student = await Student.findOne({ studentId }).populate("school");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!student.school) {
      return res.status(400).json({ error: "Student has no school assigned" });
    }

    const schoolId = student.school._id;
    const academicYear = student.school.academic_year;

    let balance = amountPaid;

    // Get unpaid or partially paid logs in order
    const logs = await FeeLog.find({
      student: student._id,
      balance: { $gt: 0 },
    }).sort({ year: 1, month: 1 });

    for (const log of logs) {
      if (balance <= 0) break;

      const toPay = Math.min(balance, log.balance);
      log.paid = (log.paid || 0) + toPay;
      log.balance -= toPay;
      log.status = log.balance === 0 ? "Paid" : "Partial";

      await log.save();
      balance -= toPay;
    }

    const payment = new FeePayment({
      student: student._id,
      school: schoolId,
      academicYear,
      amountPaid,
      mode,
      remarks,
    });

    await payment.save();

    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: "Payment processing failed" });
  }
};

// 3. Get student fee logs
exports.getFeeLogs = async (req, res) => {
  try {
    const logs = await FeeLog.find({ student: req.params.studentId }).sort({
      year: 1,
      month: 1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get all payments for student
exports.getPayments = async (req, res) => {
  try {
    const payments = await FeePayment.find({
      student: req.params.studentId,
    }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Add Custom Fee (one-time expense or fine)
exports.addCustomFeeLog = async (req, res) => {
  try {
    const { student, school, academicYear, customFees, due, paid, remarks } =
      req.body;

    const balance = due - (paid || 0);
    const status = paid === due ? "Paid" : paid > 0 ? "Partial" : "Unpaid";

    const newLog = await FeeLog.create({
      student,
      school,
      academicYear,
      month: "Custom",
      year: new Date().getFullYear(),
      type: "Custom",
      customFees,
      due,
      paid,
      balance,
      status,
      remarks,
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFeeStructure = async (req, res) => {
  try {
    const { school_code } = req.query;

    let filter = {};

    if (school_code) {
      const school = await School.findOne({ school_code });
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      filter.school = school._id;
    }

    const feeStructures = await FeeStructure.find(filter)
      .sort({ className: 1 })
      .populate("school");

    res.status(200).json(feeStructures);
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    res.status(500).json({ error: "Failed to fetch fee structures" });
  }
};

exports.getSingleFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const feeStructure = await FeeStructure.findById(id).populate("school");
    if (!feeStructure)
      return res.status(404).json({ error: "Fee structure not found" });
    res.status(200).json(feeStructure);
  } catch (error) {
    console.error("Error fetching fee structure:", error);
    res.status(500).json({ error: "Failed to fetch fee structure" });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FeeStructure.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Fee structure not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating fee structure:", error);
    res.status(500).json({ error: "Failed to update fee structure" });
  }
};

exports.deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeeStructure.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "Fee structure not found" });
    res.status(200).json({ message: "Fee structure deleted successfully" });
  } catch (error) {
    console.error("Error deleting fee structure:", error);
    res.status(500).json({ error: "Failed to delete fee structure" });
  }
};
