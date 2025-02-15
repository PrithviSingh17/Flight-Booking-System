const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./Booking");
const User = require("./User");
const PaymentMethodMaster = require("./PaymentMethodMaster");

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
        type: DataTypes.ENUM('Success', 'Failed', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      
    transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    modified_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "payments",
    timestamps: false
});

Payment.belongsTo(Booking, { foreignKey: "booking_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });
Payment.belongsTo(PaymentMethodMaster, { foreignKey: "payment_method_id" });

module.exports = Payment;
