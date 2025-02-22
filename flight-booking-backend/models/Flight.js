const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const moment = require("moment");


const Flight = sequelize.define("flight", {
  flight_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  airline_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  flight_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  departure_airport_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  departure_airport_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  departure_city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  arrival_airport_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  arrival_airport_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  arrival_city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  departure_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrival_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
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
  },
  modified_at: {
  type: DataTypes.DATE,
  defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
}
}, {
  tableName: "flights",
  timestamps: false,
});

module.exports = Flight;
