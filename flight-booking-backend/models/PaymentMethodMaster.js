const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentMethodMaster = sequelize.define(
  "paymentmethodmaster",
  {
    method_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    method_name: {
      type: DataTypes.STRING(50),
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
  },
  {

    tableName: "payment_method_master",
    timestamps: false,
  }
);

module.exports = PaymentMethodMaster;
