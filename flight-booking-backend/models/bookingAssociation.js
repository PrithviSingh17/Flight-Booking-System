const Booking = require('./Booking');
const Flight  = require('./Flight');
const Passenger = require('./Passenger');
const User = require('./User');
const BookingStatusMaster = require('./BookingStatusMaster');

module.exports = function setupDashboardAssociations() {
  // Only add the specific association needed for dashboard
  Booking.belongsTo(Flight, {
    foreignKey: 'flight_id',
    as: 'flight' // Must match what you use in bookingDashboardController
  });
  Booking.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Booking belongs to BookingStatusMaster
  Booking.belongsTo(BookingStatusMaster, {
    foreignKey: 'booking_status_id',
    as: 'status'
  });

  // Booking has many Passengers
  Booking.hasMany(Passenger, {
    foreignKey: 'booking_id',
    as: 'passengers'
  });

  // Flight has many Bookings
  Flight.hasMany(Booking, {
    foreignKey: 'flight_id',
    as: 'bookings'
  });
}

