const FeeStructure = require("../models/FeeStructure");
const FeeLog = require("../models/FeeLog");
const FeePayment = require("../models/FeePayment");
const Student = require("../models/Student");

// ✅ 1. Create/Update FeeStructure
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

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    let balance = amountPaid;

    // Fetch unpaid logs
    const logs = await FeeLog.find({
      student: studentId,
      balance: { $gt: 0 },
    }).sort({ year: 1, month: 1 });

    for (const log of logs) {
      if (balance <= 0) break;

      const toPay = Math.min(balance, log.balance);
      log.paid += toPay;
      log.balance -= toPay;
      log.status = log.balance === 0 ? "Paid" : "Partial";

      await log.save();
      balance -= toPay;
    }

    const payment = new FeePayment({
      student: studentId,
      school: student.school,
      academicYear: student.academicYear,
      amountPaid,
      mode,
      remarks,
    });

    await payment.save();

    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. Get student fee logs
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

// ✅ 4. Get all payments for student
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
