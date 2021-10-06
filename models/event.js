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
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }

});

module.exports = mongoose.model('Event', eventSchema);