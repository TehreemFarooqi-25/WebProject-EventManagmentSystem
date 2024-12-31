const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    organizer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);