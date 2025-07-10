const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const teacherSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  designation: { type: String, required: true },
  qualification: { type: String },
  doj: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true },
  address: { type: String },
  aadharNo: { type: String },
  panNo: { type: String },
  trained: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Teacher"],
    default: "Teacher",
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
