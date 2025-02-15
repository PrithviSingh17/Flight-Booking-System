const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure correct path
const moment = require('moment');

const User = sequelize.define("user", {
  user_id: {
    type: DataTypes.INTEGER,  // ✅ Ensure it's INTEGER
    autoIncrement: true,      // ✅ Automatically increments
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {  // ✅ Ensure this exists
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
        len: [10, 10]
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  role: {
    type: DataTypes.ENUM("Admin", "User"),
    allowNull: false,
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
  tableName: "users",
  timestamps: false  // Disable auto `createdAt` & `updatedAt`
},
{
  sequelize,
  modelName: "user",
  timestamps: true,  // ✅ Enables automatic createdAt and updatedAt
  underscored: true
}

);

module.exports = User;
