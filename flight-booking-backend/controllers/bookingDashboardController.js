
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const Passenger = require("../models/Passenger");
const User = require("../models/User");
const BookingStatusMaster = require("../models/BookingStatusMaster");
const { Op } = require("sequelize");
const moment = require('moment');

require('../models/bookingAssociation')();


exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const currentDate = moment();

        // Get all data in a single query
        const [user, bookings] = await Promise.all([
            User.findByPk(userId, {
                attributes: ['user_id', 'name', 'email', 'phone', 'created_at']
            }),
            Booking.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Flight,
                        as: 'flight',
                        attributes: ['flight_id', 'flight_number', 'airline_name', 
                                    'departure_city', 'arrival_city', 'departure_time']
                    },
                    {
                        model: Passenger,
                        as: 'passengers',
                        attributes: ['passenger_id', 'name', 'seat_number']
                    },
                    {
                        model: BookingStatusMaster,
                        as: 'status',
                        attributes: ['status_name'],
                        where: {
                            status_name: 'Confirmed' // Additional filter
                        },
                        required: true // Ensures inner join (only bookings with status)
                    
                    }
                ],
                order: [[Flight, 'departure_time', 'ASC']]
            })
        ]);

        // Categorize bookings
        const upcoming = bookings.filter(b => 
            moment(b.flight.departure_time).isAfter(currentDate));
        const history = bookings.filter(b => 
            moment(b.flight.departure_time).isSameOrBefore(currentDate));

        res.json({
            user,
            upcoming: upcoming.map(formatBooking),
            history: history.map(formatBooking),
            stats: {
                totalBookings: bookings.length,
                upcomingCount: upcoming.length,
                pastCount: history.length
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ 
            error: "Failed to load dashboard",
            details: error.message 
        });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.booking_id, {
            include: [
                {
                    model: Flight,
                    attributes: { exclude: ['created_at', 'modified_at'] }
                },
                {
                    model: Passenger,
                    attributes: { exclude: ['created_by', 'modified_by'] }
                },
                {
                    model: BookingStatusMaster,
                        as: 'status',
                        attributes: ['status_name'],
                        where: {
                            status_name: 'Confirmed' // Double filter for safety
                        },
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json(formatDetailedBooking(booking));
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch booking details",
            details: error.message
        });
    }
};

// Formatting helpers
function formatBooking(booking) {
    return {
        booking_id: booking.booking_id,
        flight_number: booking.flight.flight_number,
        airline: booking.flight.airline_name,
        departure_city: booking.flight.departure_city,
        arrival_city: booking.flight.arrival_city,
        departure_time: booking.flight.departure_time,
        status: booking.status.status_name,
        passenger_count: booking.passengers.length
    };
}

function formatDetailedBooking(booking) {
    return {
        booking_id: booking.booking_id,
        status: booking.status.status_name,
        booking_date: booking.created_at,
        flight: {
            ...booking.flight.get({ plain: true }),
            duration: `${Math.floor(booking.flight.duration / 60)}h ${booking.flight.duration % 60}m`
        },
        passengers: booking.passengers.map(p => ({
            name: p.name,
            seat_number: p.seat_number,
            age: p.age,
            passport_number: p.passport_number
        })),
        price: booking.total_price
    };
}

// Add this new method to bookingDashboardController.js
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { name, email, phone } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({ name, email, phone });
        
        // Return the complete user object including created_at
        const updatedUser = await User.findByPk(userId, {
            attributes: ['user_id', 'name', 'email', 'phone', 'created_at']
        });

        res.json({ 
            success: true,
            user: updatedUser  // Now includes created_at
        });
    } catch (error) {
        // error handling
    }
};
// Add this to bookingDashboardController.js
// Add this to bookingDashboardController.js
exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const bookingId = req.params.booking_id;

        // Find the booking belonging to this user
        const booking = await Booking.findOne({
            where: {
                booking_id: bookingId,
                user_id: userId
            },
            include: [
                {
                    model: BookingStatusMaster,
                    as: 'status'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Check if booking can be cancelled (only confirmed bookings)
        if (booking.status.status_name !== 'Confirmed') {
            return res.status(400).json({ 
                error: `Booking cannot be cancelled (current status: ${booking.status.status_name})` 
            });
        }

        // Update booking status to "Cancelled" (assuming status_id 3 is Cancelled)
        await booking.update({ 
            booking_status_id: 3, // Cancelled status
            modified_by: userId
        });

        res.json({ 
            success: true,
            message: "Booking cancelled successfully",
            booking_id: booking.booking_id
        });

    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({ 
            error: "Failed to cancel booking",
            details: error.message 
        });
    }
};