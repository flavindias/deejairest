'use strict';
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
  playlist_id: {
    type: Sequelize.INTEGER,
    required: true
  },
  track_id: {
    type: Sequelize.STRING,
    required: true
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  active: {
    type: Sequelize.BOOLEAN
  },
}


var modelOptions = {

}

var PlaylistTrack = db.define('playlists_track', modelDefinition, modelOptions);

module.exports = PlaylistTrack;