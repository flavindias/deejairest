'use strict';
const Sequelize = require('sequelize'),
    db = require('../../services/database');


const Track = require('./Track');

var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        required: true
    },
    location: Sequelize.GEOMETRY('POINT'),
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {

}

var Genre = db.define('genre', modelDefinition, modelOptions);
// Room.belongsTo(User, {as: 'owner', foreignKey: 'owner_id'});
// Room.belongsToMany(Track, {as: 'tracks', through: 'rooms_tracks', foreignKey: 'room_id', otherKey: 'track_id'});
// Room.belongsToMany(User, {as: 'members', through: 'rooms_users', foreignKey: 'room_id', otherKey: 'user_id'});
module.exports = Genre;

