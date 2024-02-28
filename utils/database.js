const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expensemaster_pro", "root", "Rahul@6160", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
