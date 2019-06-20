const Sequelize = require('sequelize'),
    db = require('../../services/database');

const Genre = require('Genre')
const Artist = require('Artist')

var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    genre_id:{
        type: Sequelize.INTEGER,
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

var ArtistGenre = db.define('ArtistGenre', modelDefinition, modelOptions);
ArtistGenre.hasOne(Track, {as: 'track', foreignKey: 'track_id'});
// RoomTrack.belongsTo(Room, {as: 'trac', foreignKey: 'room_id'});
module.exports = ArtistGenre;