const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Flight = require("./Flight");
const FlightStatusMaster = require("./FlightStatusMaster");

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
            model: FlightStatusMaster,
            key: "status_id",
        },
        onDelete: "SET NULL",
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
    tableName: "flight_status",
    timestamps: false,
});

module.exports = FlightStatus;
