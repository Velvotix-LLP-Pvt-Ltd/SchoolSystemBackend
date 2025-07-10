const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
  {
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
    monthlyFee: {
      type: Number,
      required: true,
    },
    feeBreakup: {
      tuition: { type: Number, default: 0 },
      admission: { type: Number, default: 0 },
      exam: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

feeStructureSchema.index(
  { school: 1, academicYear: 1, class: 1 },
  { unique: true }
);

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
