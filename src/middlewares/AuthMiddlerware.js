// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// 🔐 General token validation with sliding refresh
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // Sliding token expiration
    const newToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
        schoolId: decoded.schoolId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.setHeader("x-access-token", newToken);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Role-specific middleware
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};
