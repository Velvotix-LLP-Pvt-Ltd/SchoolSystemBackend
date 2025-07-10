const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const School = require("../models/school.model");

// 🔐 Generate JWT token with 30-minute expiry
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// ✅ Login controller (shared for both School and User)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  let user = null;
  let role = null;

  try {
    // Try School login first
    user = await School.findOne({ school_code: username });
    if (user) {
      role = "School";
    } else {
      // Fallback to User
      user = await User.findOne({ username: username });
      if (user) role = user.role;
    }

    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid username or password" });

    const token = generateToken({
      id: user._id,
      role,
      schoolId: user._id,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      role,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};

// ✅ Logout controller (client just discards token)
exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// ✅ Token refresh (sliding session)
exports.refreshToken = async (req, res) => {
  try {
    const oldToken = req.headers.authorization?.split(" ")[1];
    if (!oldToken) return res.status(401).json({ error: "Token required" });

    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);

    const newToken = generateToken({
      id: decoded.id,
      role: decoded.role,
      schoolId: decoded.schoolId,
    });

    res.status(200).json({ token: newToken });
  } catch (err) {
    res.status(401).json({ error: "Token expired or invalid" });
  }
};
