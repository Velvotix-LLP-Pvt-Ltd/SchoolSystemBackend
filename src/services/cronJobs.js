const cron = require("node-cron");
const { generateMonthlyFeeLogs } = require("./generateFeeLogs");

const startCronJobs = () => {
  cron.schedule("0 2 1 * *", async () => {
    console.log("Running monthly fee generator 🧾...");
    await generateMonthlyFeeLogs();
  });
};

module.exports = startCronJobs;
