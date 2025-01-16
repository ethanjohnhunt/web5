const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    linkedEbay: { type: Boolean, default: false }, 
    ebayToken: { type: String, default: null }, 
    ebayTokenExpiry: { type: Date, default: null }, 
});

module.exports = mongoose.model('User', userSchema);
