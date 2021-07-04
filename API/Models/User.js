const mongoose = require('mongoose');

const userSchema = {
    email:String,
    password:String
}

const User = mongoose.model('users',userSchema);

module.exports = User;
