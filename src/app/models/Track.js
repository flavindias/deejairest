'use strict';

const Sequelize = require('sequelize'),
    db = require('../../services/database');

const Artist = require('./Artist');

var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
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
    isrc: {
        type: Sequelize.STRING,
        unique: true,
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {


}

var Track = db.define('track', modelDefinition, modelOptions);
Track.belongsToMany(Artist, {as: 'artists', through: 'tracks_artists', foreignKey: 'track_id', otherKey: 'artist_id'});
module.exports = Track;