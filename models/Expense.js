const { DataTypes } = require("sequelize");
const sequelize = require('../utils/database');

const Expense = sequelize.define('expenses', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    type: {
        type: DataTypes.STRING, 
        allowNull: false 
    },

    imgPath: {
        type: DataTypes.TEXT, 
        allowNull: false 
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    amount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    },

    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    
});

module.exports = Expense;
