const mongoose = require("mongoose");

const feeLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    month: {
      type: String, // E.g. "July"
      required: true,
    },
    year: {
      type: Number, // E.g. 2025
      required: true,
    },
    due: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

feeLogSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("FeeLog", feeLogSchema);
