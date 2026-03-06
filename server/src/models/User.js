const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    phone: String,
    role: String,
    level: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },
    streaks: [Number] // Array of days
});

module.exports = mongoose.model('User', UserSchema);