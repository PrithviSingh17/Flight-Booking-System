const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const moment = require('moment');

const User = require("./User");
const Flight = require("./Flight");
const BookingStatusMaster = require("./BookingStatusMaster");

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
            model: User,
            key: "user_id"
        }
    },
    flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Flight,
            key: "flight_id"
        }
    },
    booking_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BookingStatusMaster,
            key: "booking_status_id"
        }
    },
    payment_status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      }
      ,      
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
    timestamps: false
});

module.exports = Booking;
