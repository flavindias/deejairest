'use strict';
const Sequelize = require('sequelize'),
  db = require('../../services/database');

const PlaylistTrack = require('./PlaylistTrack');
const Track = require('./Track');


var modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: Sequelize.INTEGER,
    required: true
  },
  approach: {
    type: Sequelize.ENUM('IA', 'USER'),
    required: true
  },
  active: {
    type: Sequelize.BOOLEAN
  },
}


var modelOptions = {

}

var Playlist = db.define('playlist', modelDefinition, modelOptions);
// Playlist.hasMany(PlaylistTrack, { as: 'tracks', foreignKey: 'playlist_id' });
Playlist.belongsToMany(Track, { as: 'tracks', through: 'playlists_tracks', foreignKey: 'playlist_id', otherKey: 'track_id' });
module.exports = Playlist;