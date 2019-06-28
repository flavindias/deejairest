'use strict';
const Sequelize = require('sequelize'),
    db = require('../../services/database');


const Genre = require('./Genre');

var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        required: true
    },
    uri: {
        type: Sequelize.STRING,
    },
    href: {
        type: Sequelize.STRING,
    },
    image: {
        type: Sequelize.STRING,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {

}

var Artist = db.define('artist', modelDefinition, modelOptions);
Artist.belongsToMany(Genre, { as: 'genres', through: 'artists_genres', foreignKey: 'artist_id', otherKey: 'genre_id' });
// Room.belongsTo(User, {as: 'owner', foreignKey: 'owner_id'});
// Room.belongsToMany(Track, {as: 'tracks', through: 'rooms_tracks', foreignKey: 'room_id', otherKey: 'track_id'});
// Room.belongsToMany(User, {as: 'members', through: 'rooms_users', foreignKey: 'room_id', otherKey: 'user_id'});
module.exports = Artist;

