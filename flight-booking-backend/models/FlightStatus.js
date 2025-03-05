const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Flight = require("./Flight");
const FlightStatusMaster = require("./FlightStatusMaster")
const moment =require('moment');// Pass sequelize and DataTypes

const FlightStatus = sequelize.define("flightStatus", {
    status_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Flight,
            key: "flight_id",
        },
        onDelete: "CASCADE",
    },
    status_name_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: FlightStatusMaster, // Use the correctly imported model
            key: "status_id",
        },
        onDelete: "SET NULL",
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        get() {
            return moment.utc(this.getDataValue("created_at")).tz("Asia/Kolkata").format();
        }
    },
      modified_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modified_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
      },
}, {
    tableName: "flight_status",
    timestamps: false,
});

// Define associations
FlightStatus.belongsTo(Flight, { foreignKey: "flight_id" });


module.exports = FlightStatus;