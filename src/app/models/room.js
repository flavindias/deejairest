const mongoose = require('../../database');

const RoomSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    members: {
        type: [String],
    },
    location:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    songs: {
        type: [String],
    },
})

module.exports = mongoose.model('Room', RoomSchema);