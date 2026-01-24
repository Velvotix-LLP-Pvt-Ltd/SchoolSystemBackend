const mongoose = require("mongoose");

const PaymentLogSchema = new mongoose.Schema({
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
  class: {
    type: String,
    required: true,
  },
  month: {
    type: String, // e.g., "July"
    required: true,
  },
  year: {
    type: Number, // e.g., 2025
    required: true,
  },

  // Expected dues
  expected: {
    tuitionFee: { type: Number, default: 0 },
    examFee: { type: Number, default: 0 },
    boardExamFee: { type: Number, default: 0 },
    additionalCharges: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        isManual: { type: Boolean, default: false },
      },
    ],
  },

  // Payments made toward this month
  payments: [
    {
      amount: { type: Number, required: true },
      mode: {
        type: String,
        enum: ["Cash", "Online", "Bank", "UPI"],
        required: true,
      },
      date: { type: Date, default: Date.now },
      remarks: { type: String },
    },
  ],

  // Summary fields
  totalDue: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentLog", PaymentLogSchema);
