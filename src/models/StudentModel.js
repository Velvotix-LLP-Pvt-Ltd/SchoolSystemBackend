const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    class: { type: String, required: true },
    section: { type: String },
    admissionDate: { type: Date, required: true },
    category: { type: String },
    religion: { type: String },
    motherTongue: { type: String },
    aadhar: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    address: {
      line1: String,
      line2: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },
    contact: {
      phone: String,
      email: String,
    },
    cwsn: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Transferred", "PassedOut"],
      default: "Active",
    },

    // Login support
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Student",
      enum: ["Student"],
    },
  },
  { timestamps: true }
);

// Hash password before save
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Student", studentSchema);
