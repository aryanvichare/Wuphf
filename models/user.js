var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    friends: {
        type: Array,
        required: true
    },
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
