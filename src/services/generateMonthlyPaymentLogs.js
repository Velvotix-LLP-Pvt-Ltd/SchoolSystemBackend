const Student = require("../models/StudentModel.js");
const PaymentStructure = require("../models/PaymentStructure.Model.js");
const PaymentLog = require("../models/PaymentLog.Model.js");

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

exports.generateMonthlyPaymentLogs = async (month, year, academicYear) => {
  try {
    const monthName = MONTHS[month];

    const students = await Student.find({}); // You can filter by active or academicYear if needed

    for (const student of students) {
      const structure = await PaymentStructure.findOne({
        school: student.school,
        class: student.class,
        academicYear,
      });

      if (!structure) continue;

      const existingLog = await PaymentLog.findOne({
        student: student._id,
        month: monthName,
        year,
        academicYear,
      });

      if (existingLog) continue;

      let totalDue = 0;
      const expected = {
        tuitionFee: structure.tuitionFee,
        examFee: 0,
        boardExamFee: 0,
        additionalCharges: [],
      };

      totalDue += structure.tuitionFee;

      // Add registration fee if this is the configured month
      if (structure.registrationFeeMonth === monthName) {
        expected.additionalCharges.push({
          title: "Registration Fee",
          amount: structure.registrationFee,
          isManual: false,
        });
        totalDue += structure.registrationFee;
      }

      // Add exam fee if this month matches any exam term
      const exam = structure.examFees.find((fee) => fee.month === monthName);
      if (exam) {
        expected.examFee = exam.amount;
        totalDue += exam.amount;
      }

      const newLog = new PaymentLog({
        student: student._id,
        school: student.school,
        academicYear,
        class: student.class,
        month: monthName,
        year,
        expected,
        totalDue,
        totalPaid: 0,
        balance: totalDue,
        isPaid: false,
      });

      await newLog.save();
    }

    console.log(`✅ Payment logs generated for ${monthName} ${year}`);
  } catch (err) {
    console.error("❌ Error generating monthly payment logs:", err);
  }
};
