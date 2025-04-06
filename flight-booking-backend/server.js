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
const airportRoutes = require("./routes/airportRoutes");
const errorHandler = require("./middleware/errorHandler");
const bookingStatusRoutes = require("./routes/bookingStatusRoutes");
const flightStatusMasterRoutes = require("./routes/flightStatusMasterRoutes");
const paymentMethodMasterRoutes = require("./routes/paymentMethodMasterRoutes");
const bookingDashboardRoutes = require("./routes/bookingDashboardRoutes");
dotenv.config();

const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());


app.use("/api/users", usersRoutes);
app.use("/api/flights", flightsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/passengers", passengersRoutes);
app.use("/api/flight-status", flightStatusRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/booking-status", bookingStatusRoutes);
app.use("/api/flight-status-master", flightStatusMasterRoutes);
app.use("/api/payment-methods", paymentMethodMasterRoutes);
app.use('/api/dashboard', bookingDashboardRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
