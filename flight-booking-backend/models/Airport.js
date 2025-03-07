const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const moment =require('moment'); // Adjust the path to your Sequelize configuration

const Airport = sequelize.define("Airport", {
  airport_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  airport_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
  },
}, {
    tableName: "airports",
    timestamps: false
});

module.exports = Airport;