const Sequelize = require('sequelize'),
    db = require('../../services/database');

const Track = require('Track')
const Room = require('Room')

var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    track_id:{
        type: Sequelize.STRING,
        required: true
    },
    room_id: {
        type: Sequelize.INTEGER,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {


}

var RoomTrack = db.define('RoomTrack', modelDefinition, modelOptions);
RoomTrack.hasOne(Track, {as: 'track', foreignKey: 'track_id'});
// RoomTrack.belongsTo(Room, {as: 'trac', foreignKey: 'room_id'});
module.exports = RoomTrack;
