const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./Booking");
const User = require("./User");
const PaymentMethodMaster = require("./PaymentMethodMaster");
const moment = require('moment');

const Payment = sequelize.define("payment", {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id"
        },
        onDelete: "CASCADE"
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: PaymentMethodMaster,
            key: "method_id"
        },
        onDelete: "SET NULL"
    },
    payment_status: {
        type: DataTypes.ENUM('Pending',
    'Paid',      // Added
    'Success',   // For bookings
    'Failed',
      ),
        allowNull: false,
        defaultValue: 'Pending'
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
    tableName: "payments",
    timestamps: false
});

Payment.belongsTo(Booking, { foreignKey: "booking_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });
Payment.belongsTo(PaymentMethodMaster, { foreignKey: "payment_method_id" });

module.exports = Payment;
