const mongoose = require('../../database');

const UserSchema = new mongoose.Schema({
    birthdate: {
        type: Date
    },
    country: {
        type: String
    },
    display_name: {
        type: String
    },
    email: {
        type: String
    },
    href: {
        type: String
    },
    id: {
        type: String
    },
    product: {
        type: String
    },
    type: {
        type: String
    },
    uri: {
        type: String
    },
    dislikedSongs: {
        type: [String],
        index: true
    },
    createdAt: {
        type: Date,
        defaultValue: Date.now()
    },
});

const User  = mongoose.model('User', UserSchema);

module.exports = User;