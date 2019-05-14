const mongoose = require('../../database');


const LocationScheme = new mongoose.Schema({
    user: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    room: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Room'
    }],
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

module.exports = mongoose.model('Location', LocationScheme);