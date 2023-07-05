const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: false,
    },
    phoneNumber: { 
        type: Number,
        min : 1000000000,
        max : 9999999999,
        required: true,
    },
});

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;