const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const School = require("../models/school.model");
const Teacher = require("../models/TeachersModel");

// 🔐 Generate JWT token with 30-minute expiry
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// ✅ Login controller (shared for both School and User)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = null;
    let role = null;

    // 1. Try School login using school_code
    user = await School.findOne({ school_code: username });
    if (user) {
      role = "School";
    } else {
      // 2. Try Admin/User login using username
      user = await User.findOne({ username });
      if (user) {
        role = user.role;
      } else {
        // 3. Try Teacher login using teacherId
        user = await Teacher.findOne({ teacherId: username });
        if (user) {
          role = "Teacher";
        }
      }
    }

    // If user not found
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      role,
      schoolId: user.school || (role === "School" ? user._id : null),
    });

    // Respond with token
    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id,
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

    const newToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
        schoolId: decoded.schoolId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({ token: newToken });
  } catch (err) {
    res.status(401).json({ error: "Token expired or invalid" });
  }
};

exports.check = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      valid: false,
      error: "Authorization header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      valid: true,
      expired: false,
      decoded,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        valid: false,
        expired: true,
        error: "Token expired",
      });
    }

    return res.status(401).json({
      valid: false,
      expired: false,
      error: "Invalid token",
    });
  }
};
