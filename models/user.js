'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    birthdate: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};