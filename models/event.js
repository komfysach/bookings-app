const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        data: Buffer,
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }

});

module.exports = mongoose.model('Event', eventSchema);