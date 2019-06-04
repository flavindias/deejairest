'use strict';

const Sequelize = require('sequelize'),
    db = require('../../services/database');

var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        required: true
    },
    duration: {
        type: Sequelize.INTEGER,
        required: true
    },
    popularity: {
        type: Sequelize.INTEGER,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {


}

var Track = db.define('Track', modelDefinition, modelOptions);

module.exports = Track;