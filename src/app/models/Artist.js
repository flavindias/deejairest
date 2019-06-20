
const Sequelize = require('sequelize'),
    db = require('../../services/database');


const Track = require('./Track');

var modelDefinition = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        required: true
    },
    uri:{
        type: Sequelize.STRING,
    },
    href:{
        type: Sequelize.STRING,
    },
    image:{
        type: Sequelize.STRING,
        required: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
}

var modelOptions = {

}

var Artist = db.define('Artist', modelDefinition, modelOptions);
// Room.belongsTo(User, {as: 'owner', foreignKey: 'owner_id'});
// Room.belongsToMany(Track, {as: 'tracks', through: 'rooms_tracks', foreignKey: 'room_id', otherKey: 'track_id'});
// Room.belongsToMany(User, {as: 'members', through: 'rooms_users', foreignKey: 'room_id', otherKey: 'user_id'});
module.exports = Artist;

