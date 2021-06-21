const mongoose = require('mongoose');

const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { type: String, required: true },
    date: { type: String, default: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  },
    profileImageName: String,
    OTPandExp: String,
    verified: {type: String, default: 'no.0'}
})

module.exports = mongoose.model('User',User);
