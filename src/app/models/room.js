const mongoose = require('../../database');

const RoomSchema = new mongoose.Schema({
    code:{
        type: String
    },
    owner: String,
    members: [String],
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
    songs: [String]
})

module.exports = mongoose.model('Room', RoomSchema);