'use strict';
const Sequelize = require('sequelize'),
  db = require('../../services/database');

const Track = require('./Track');

var modelDefinition = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  track_id: {
    type: Sequelize.STRING,
    required: true
  },
  danceability: {
    type: Sequelize.FLOAT,
  },
  energy: {
    type: Sequelize.FLOAT,
  },
  key: {
    type: Sequelize.FLOAT,
  },
  loudness: {
    type: Sequelize.FLOAT,
  },
  mode: {
    type: Sequelize.FLOAT,
  },
  speechiness: {
    type: Sequelize.FLOAT,
  },
  acousticness: {
    type: Sequelize.FLOAT,
  },
  instrumentalness: {
    type: Sequelize.FLOAT,
  },
  liveness: {
    type: Sequelize.FLOAT,
  },
  valence: {
    type: Sequelize.FLOAT,
  },
  tempo: {
    type: Sequelize.FLOAT,
  },
  duration_ms: {
    type: Sequelize.FLOAT,
  },
  time_signature: {
    type: Sequelize.FLOAT,
  },
  active: {
    type: Sequelize.BOOLEAN
  },
}

var modelOptions = {

}

var Feature = db.define('feature', modelDefinition, modelOptions);
// Feature.belongsTo(Track);
module.exports = Feature;