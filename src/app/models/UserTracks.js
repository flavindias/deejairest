'use strict';
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize'),
    db = require('../../services/database');

const Track = require('./Track');
const User = require('./User');

var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: Sequelize.INTEGER,
        required: true
    },
    track_id: {
        type: Sequelize.STRING,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}


var modelOptions = {

}

var UserTrack = db.define('Users_Track', modelDefinition, modelOptions);

module.exports = UserTrack;