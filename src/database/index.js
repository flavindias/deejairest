const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/deejaidb');

mongoose.Promise = global.Promise;

module.exports = mongoose;