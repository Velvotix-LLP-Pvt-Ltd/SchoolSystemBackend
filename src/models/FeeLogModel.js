const mongoose = require("mongoose");

// Schema for custom fee heads like "Books", "Library Fine", etc.
const customFeeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Schema for recurring fee breakup
const feeBreakupSchema = new mongoose.Schema({
  tuition: { type: Number, default: 0 },
  admission: { type: Number, default: 0 },
  exam: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  other: { type: Number, default: 0 },
});

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

    type: {
      type: String,
      enum: ["Monthly", "Custom"],
      required: true,
    },

    feeBreakup: {
      type: feeBreakupSchema,
      default: () => ({}),
    },

    customFees: {
      type: [customFeeSchema],
      default: [],
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
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Unique index only for monthly logs (not for custom)
feeLogSchema.index(
  { student: 1, month: 1, year: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "Monthly" },
  }
);

module.exports = mongoose.model("FeeLog", feeLogSchema);
