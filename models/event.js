const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    totalPax: {
        type: Number,
        required: true
    },
    img: {
        data: Buffer,
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }

});

module.exports = mongoose.model('Event', eventSchema);