const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: ''
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('categories', categoreSchema);