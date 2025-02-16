const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};




// 📌 Middleware for Role-Based Access
exports.authorizeRole = (role) => {
  return (req, res, next) => {
      console.log("DEBUG: User Role ->", req.user.role);  // Debug log

      if (req.user.role.toLowerCase() !== role.toLowerCase()) {
          return res.status(403).json({ error: "Access forbidden: insufficient permissions" });
      }

      next();
  };
};

