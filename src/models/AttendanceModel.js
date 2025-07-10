const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recordedByModel",
    },
    recordedByModel: {
      type: String,
      required: true,
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// 🛡️ Ensure one record per student per date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
