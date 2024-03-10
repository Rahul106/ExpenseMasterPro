const { DataTypes } = require("sequelize");
const sequelize = require('../utils/database'); 

const User = sequelize.define("user", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // totalamount: {
  //   type: DataTypes.DOUBLE,
  //   defaultValue: 0
  // },

  // totalincome: {
  //   type: DataTypes.DOUBLE,
  //   defaultValue: 0
  // },
  
  ispremiumuser: DataTypes.BOOLEAN

});

module.exports = User;
