'use strict';
const Sequelize = require('sequelize'),
  db = require('../../services/database');

const PlaylistTrack = require('./PlaylistTrack');
const User = require('./User');

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

module.exports = Playlist;