const mongoose = require('../../database');

const RoomSchema = new mongoose.Schema({
    code:{
        type: String
    },
    user: {

    },
    location:{

    }
})

module.exports = mongoose.model('Room', RoomSchema);