// cron/monthlyPaymentLogCron.js
const cron = require("node-cron");
const {
  generateMonthlyPaymentLogs,
} = require("../services/generateMonthlyPaymentLogs");

function determineAcademicYear(year, month) {
  return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

function startMonthlyPaymentLogCron() {
  cron.schedule("0 2 1 * *", async () => {
    try {
      const now = new Date();
      const month = now.getMonth(); // 0 = Jan
      const year = now.getFullYear();
      const academicYear = determineAcademicYear(year, month);

      console.log(
        `⏳ Generating logs for ${month + 1}/${year} (${academicYear})`
      );
      await generateMonthlyPaymentLogs(month, year, academicYear);
      console.log(
        `✅ Payment log generation completed for ${month + 1}/${year}`
      );
    } catch (error) {
      console.error("❌ Cron error:", error);
    }
  });

  console.log("✅ Monthly Payment Log Cron scheduled.");
}

// 👇 This is important
module.exports = {
  startMonthlyPaymentLogCron,
};
