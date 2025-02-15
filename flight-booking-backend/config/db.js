const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("flight_booking_db", "postgres", "password1234", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // Optional: Set to true to see SQL logs in the console
  timezone: '+05:30',
});

module.exports = sequelize;

