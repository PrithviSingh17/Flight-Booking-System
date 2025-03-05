const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const moment =require('moment');

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
  },
  {

    tableName: "payment_method_master",
    timestamps: false,
  }
);

module.exports = PaymentMethodMaster;
