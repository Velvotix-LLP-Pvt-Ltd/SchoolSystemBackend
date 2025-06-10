const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //define schemas
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
