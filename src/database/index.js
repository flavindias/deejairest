const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/deejaidb', {useMongoClient: true});

mongoose.Promise = global.Promise;

module.exports = mongoose;