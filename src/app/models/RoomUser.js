const Sequelize = require('sequelize'),
    db = require('../../services/database');

const User = require('./User')


var modelDefinition = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: Sequelize.INTEGER,
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

var RoomUser = db.define('rooms_users', modelDefinition, modelOptions);
RoomUser.belongsTo(User, {as: 'member', foreignKey: 'user_id'});
module.exports = RoomUser;