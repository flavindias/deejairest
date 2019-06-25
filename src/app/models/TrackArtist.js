const Sequelize = require('sequelize'),
    db = require('../../services/database');

const Track = require('./Track')
const Artist = require('./Artist')

var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    track_id:{
        type: Sequelize.STRING,
        required: true
    },
    artist_id: {
        type: Sequelize.STRING,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {


}

var TrackArtist = db.define('tracks_artists', modelDefinition, modelOptions);
// TrackArtist.hasOne(Track, {as: 'track', foreignKey: 'track_id'});
// RoomTrack.belongsTo(Room, {as: 'trac', foreignKey: 'room_id'});
module.exports = TrackArtist;