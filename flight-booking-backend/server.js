const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const usersRoutes = require("./routes/usersRoutes");
const flightsRoutes = require("./routes/flightsRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const passengersRoutes = require("./routes/passengersRoutes");
const flightStatusRoutes = require("./routes/flightStatusRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/flights", flightsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/passengers", passengersRoutes);
app.use("/api/flight-status", flightStatusRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
