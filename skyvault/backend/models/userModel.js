const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String,
    },
    userType: {
        type: String,
    },
}, {
    timestamps: true
});

// Add auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('users', userSchema);
