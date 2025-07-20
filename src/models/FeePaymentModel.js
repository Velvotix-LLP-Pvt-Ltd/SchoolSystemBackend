const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
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
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    mode: {
      type: String,
      enum: ["Cash", "Online", "Bank Transfer", "Cheque"],
      required: true,
    },
    remarks: String,
    RemainingBalance: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeePayment", feePaymentSchema);
