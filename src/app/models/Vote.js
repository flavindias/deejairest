'use strict';
const Sequelize = require('sequelize'),
  db = require('../../services/database');

var modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    required: true
  },
  playlist_track_id: {
    type: Sequelize.STRING,
    required: true
  },
  rating: {
    type: Sequelize.FLOAT,
    require: true
  },
  active: {
    type: Sequelize.BOOLEAN
  },
}


var modelOptions = {

}

var Vote = db.define('vote', modelDefinition, modelOptions);

module.exports = Vote;