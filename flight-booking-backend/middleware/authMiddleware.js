const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Ensure this contains the `id` field
    console.log("Decoded User:", req.user); // Debug log
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};




// 📌 Middleware for Role-Based Access
exports.authorizeRole = (role) => {
  return (req, res, next) => {
      // Log both user role and the required role
      console.log("DEBUG: User Role ->", req.user.role);
      console.log("DEBUG: Required Role ->", role);

      // Convert the role parameter to a string to avoid array issues
      const requiredRole = String(role).trim().toLowerCase();
      const userRole = String(req.user.role).trim().toLowerCase();

      // Log the final comparison values
      console.log("DEBUG: Comparing roles -> User:", userRole, "Required:", requiredRole);

      if (userRole !== requiredRole) {
          return res.status(403).json({ error: "Access forbidden: insufficient permissions" });
      }

      next();
  };
};


