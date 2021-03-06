'use strict';

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
    birthdate: {
        type: Sequelize.DATE,
    },
    country: {
        type: Sequelize.STRING,
    },
    display_name: {
        type: Sequelize.STRING,

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    href: {
        type: Sequelize.STRING,
    },
    spotify_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    product: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
    },
    photo: {
        type: Sequelize.STRING,
    },
    hash_password: Sequelize.STRING,
    reset_password_token: Sequelize.STRING,
    reset_password_token_expires_in: Sequelize.DATE,
    active: {
        type: Sequelize.BOOLEAN
    },
}

// 2: The model options.
var modelOptions = {
    // instanceMethods: {
    //     // Compares two passwords.
    //     comparePasswords: function (password, user, callback) {
    //         bcrypt.compare(password, user.password, function(error, isMatch) {
    //             if(error) {
    //                 console.log(error);
    //                 return callback(error);
    //             }
    //
    //             return callback(null, isMatch);
    //         });
    //     }
    // },
    // hooks: {
    //     beforeValidate: hashPassword
    // },
    // hierarchy: true

};

// 3: Definindo o model de Individual.
var User = db.define('user', modelDefinition, modelOptions);
User.belongsToMany(Track, { as: 'tracks', through: 'users_tracks', foreignKey: 'user_id', otherKey: 'track_id' });
module.exports = User;
