const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    fileid: {
        type: String,
        required: true,
    },
    s3path: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('userFileMap', userSchema);
