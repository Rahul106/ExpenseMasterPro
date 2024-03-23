const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Password = sequelize.define('Password', {

    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },

    active: Sequelize.BOOLEAN,

});



module.exports = Password;