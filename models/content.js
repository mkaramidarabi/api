const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);