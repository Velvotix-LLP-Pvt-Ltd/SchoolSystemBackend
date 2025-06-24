const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema(
  {
    //define schemas
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      //minlength: [3, 'Username must be at least 3 characters'],
      //maxlength: [30, 'Username must not exceed 30 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: false,
      sparse: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {    //hashed
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: [50, 'Name must not exceed 50 characters']
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    profilePic: {
      type: String,
      default: "", // URL string
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// password reset token method
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // You can store hashed version if needed later
  return resetToken;
};


module.exports = mongoose.model("User", userSchema);
