const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./Booking");
const moment = require('moment');

const Passenger = sequelize.define("passenger", {
    passenger_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Booking,
            key: "booking_id"
        },
        onDelete: "CASCADE"
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false
    },
    seat_number: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    passport_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    nationality: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    contact_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            len: [10, 10] 
        }
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    special_requests: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    frequent_flyer_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    baggage_weight: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: true
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
      }
}, {
    timestamps: false
});

Passenger.belongsTo(Booking, { foreignKey: "booking_id", onDelete: "CASCADE" });

module.exports = Passenger;
