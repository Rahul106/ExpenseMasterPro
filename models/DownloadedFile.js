const DataTypes = require('sequelize');
const sequelize = require('../utils/database');


const DownloadedFile = sequelize.define('downloadedFiles', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
});


module.exports = DownloadedFile;
