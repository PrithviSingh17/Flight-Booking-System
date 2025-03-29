const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./Booking"); // Assuming Booking model is in the same directory

const BookingStatusMaster = sequelize.define("BookingStatusMaster", {
    status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    modified_by: {
        type: DataTypes.INTEGER,
    },
    modified_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    tableName: "booking_status_master",
    timestamps: false,

}
);
BookingStatusMaster.hasMany(Booking, {
    foreignKey: "booking_status_id",
    as: "bookings"
  });
module.exports = BookingStatusMaster;