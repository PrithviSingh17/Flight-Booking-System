const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const moment = require('moment');

const Booking = sequelize.define("Booking", {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "user_id"
        }
    },
    flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "flights",
            key: "flight_id"
        }
    },
    booking_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "booking_status_master",
            key: "status_id"
        }
    },
    payment_status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    roundtrip_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "bookings",
            key: "booking_id"
        }
    },
    is_roundtrip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        get() {
            return moment.utc(this.getDataValue("created_at")).tz("Asia/Kolkata").format();
        }
    },
    modified_by: {
        type: DataTypes.INTEGER
    },
    modified_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: "bookings",
    timestamps: false,
    hooks: {
        beforeCreate: async (booking) => {
            if (booking.is_roundtrip && !booking.roundtrip_id) {
                throw new Error("Roundtrip bookings must reference another booking");
            }
        }
    }
},
{
    tableName: "bookings",
    timestamps: false,
    hooks: {
        beforeCreate: async (booking) => {
            // Modified validation to allow temporary null for roundtrip_id
            if (booking.is_roundtrip && !booking.roundtrip_id) {
                // We'll set the roundtrip_id after both bookings are created
                return;
            }
        },
        afterCreate: async (booking) => {
            // Additional hook if you need to perform any post-creation logic
        }
    }
});


module.exports = Booking;
