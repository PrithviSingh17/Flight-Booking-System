const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookingStatusMaster = sequelize.define("BookingStatusMaster", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  modified_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "booking_status_master",
  timestamps: false,
});

module.exports = BookingStatusMaster;
