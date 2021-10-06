const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    fileLocation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', imageSchema);