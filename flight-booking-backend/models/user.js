const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); 
const moment = require('moment');

const User = sequelize.define("user", {
  user_id: {
    type: DataTypes.INTEGER,  
    autoIncrement: true,      
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
  phone: {  
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
  timestamps: true,  
  underscored: true
}

);

module.exports = User;
