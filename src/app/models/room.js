'use strict';
const Sequelize = require('sequelize'),
    db = require('../../services/database');

const User = require('./User');
const Track = require('./Track');
const Playlist = require('./Playlist');

const RoomUser = require('./RoomUser');

var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: Sequelize.STRING,
        required: true
    },
    owner_id: {
        type: Sequelize.INTEGER,
        required: true
    },
    location: Sequelize.GEOMETRY('POINT'),
    public: {
        type: Sequelize.BOOLEAN
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {

}

var Room = db.define('room', modelDefinition, modelOptions);
Room.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
Room.hasMany(Playlist, { as: 'playlists', foreignKey: 'room_id' });
// Room.hasMany(RoomUser, {as: 'members', foreignKey: 'room_id'});
// Room.belongsToMany(Track, { as: 'tracks', through: 'rooms_tracks', foreignKey: 'room_id', otherKey: 'track_id' });
Room.belongsToMany(User, { as: 'members', through: 'rooms_users', foreignKey: 'room_id', otherKey: 'user_id' });
module.exports = Room;

