const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    patron: {
        type: Schema.Types.ObjectId,
        ref: 'Patron'
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);