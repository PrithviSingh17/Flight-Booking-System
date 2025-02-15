// middleware.js

// Authentication Middleware (Basic - Placeholder for Future Expansion)
const authenticateUser = (req, res, next) => {
    console.log("Authentication middleware triggered");
    next(); // Proceed to the next middleware or route handler
};



// Request Logging Middleware
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

module.exports = { authenticateUser, errorHandler, requestLogger };
