const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    session:{
        type: String,
        required: false
    }
});
let User = mongoose.model('User', UserSchema);
module.exports = User;