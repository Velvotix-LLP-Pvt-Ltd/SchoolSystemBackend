const mongoose = require("mongoose");

const PaymentStructureSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  academicYear: {
    type: String,
    required: true, // e.g., "2025-2026"
  },
  class: {
    type: String,
    required: true,
  },

  // Recurring monthly
  tuitionFee: {
    type: Number,
    required: true,
  },

  // One-time per year
  registrationFee: {
    type: Number,
    default: 0,
  },
  registrationFeeMonth: {
    type: String,
    default: "June", // e.g., 'June'
  },

  // Optional manual (e.g., books, dress)
  additionalCharges: [
    {
      title: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],

  // Term-wise exam fee (e.g., 3 times per year)
  examFees: [
    {
      term: { type: String, required: true }, // e.g., "Term 1"
      month: { type: String, required: true }, // e.g., "August"
      amount: { type: Number, required: true },
    },
  ],

  // Optional manual board exam fee
  boardExamFee: {
    amount: { type: Number, default: 0 },
    description: { type: String }, // e.g., "CBSE Class 10"
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentStructure", PaymentStructureSchema);
