const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("flight_booking_db", "postgres", "password1234", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // Optional: Set to true to see SQL logs in the console
  timezone: '+05:30',
   pool: {
    max: 5,
    min: 0,
    acquire: 30000,  // 30 seconds timeout
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => console.log('✅ PostgreSQL connected successfully'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

module.exports = sequelize;


