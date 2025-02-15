const jwt = require('jsonwebtoken');

// Use the same secret key as in your backend
const secretKey = "d677b6829e489b0687a2aade58493950fe44e3ae4588dcd7bc8d55a5e0af0f93"; 

// Create an admin payload
const adminPayload = { user_id: "admin_static_id", role: "admin" };

// Generate the token (valid for 1 year)
const token = jwt.sign(adminPayload, secretKey, { expiresIn: "365d" });

console.log("Generated Admin Token:", token);
