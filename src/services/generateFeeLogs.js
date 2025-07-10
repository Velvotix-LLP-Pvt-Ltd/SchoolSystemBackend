const Student = require("../models/StudentModel");
const FeeStructure = require("../models/FeeStructureModel");
const FeeLog = require("../models/FeeLogModel");

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

exports.generateMonthlyFeeLogs = async () => {
  const now = new Date();
  const month = MONTHS[now.getMonth()];
  const year = now.getFullYear();

  const students = await Student.find().populate("school");

  for (const student of students) {
    try {
      if (!student.school) {
        console.warn(`No school reference for student: ${student.name}`);
        continue;
      }

      const schoolId = student.school._id;
      const academicYear = student.school.academic_year;

      const structure = await FeeStructure.findOne({
        school: schoolId,
        academicYear,
        class: student.class,
      });

      if (!structure) {
        console.warn(`Fee structure not found for ${student.name}`);
        continue;
      }

      const exists = await FeeLog.findOne({
        student: student._id,
        month,
        year,
      });

      if (exists) continue;

      const newLog = new FeeLog({
        student: student._id,
        school: schoolId,
        academicYear,
        month,
        year,
        due: structure.monthlyFee,
        balance: structure.monthlyFee,
        status: "Unpaid",
      });

      await newLog.save();
    } catch (err) {
      console.error(`Error for student ${student._id}: ${err.message}`);
    }
  }

  console.log(`[${month} ${year}] ✅ Monthly fee logs generated.`);
};
