const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 70
    },
    firstName: {
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    isStaff:{
        type: Boolean,
        default: false
    },
    activationToken:{
        type: String
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});



module.exports = User = mongoose.model('User', userSchema);
