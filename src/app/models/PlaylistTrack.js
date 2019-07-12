'use strict';
const Sequelize = require('sequelize'),
  db = require('../../services/database');

const Vote = require('./Vote');
const Track = require('./Track');

var modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  playlist_id: {
    type: Sequelize.INTEGER,
    required: true
  },
  track_id: {
    type: Sequelize.STRING,
    required: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    required: true
  },
  active: {
    type: Sequelize.BOOLEAN
  },
}


var modelOptions = {

}

var PlaylistTrack = db.define('playlists_track', modelDefinition, modelOptions);
// PlaylistTrack.belongsTo(Playlist, { as: 'playlist', foreignKey: 'playlist_id' });
PlaylistTrack.belongsTo(Track, { as: 'track', foreignKey: 'track_id' });
PlaylistTrack.hasMany(Vote, { as: 'votes', foreignKey: 'playlist_track_id' });

module.exports = PlaylistTrack;