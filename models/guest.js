///// DEPENDENCIES /////
const mongoose = require('mongoose');

///// SCHEMA /////

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: Date, default: Date.now(), required: true },
    table: { type: String },
    guests: { type: String },
    email: { type: String },
    comments: { type: String },
});

module.exports = mongoose.model("Guest", guestSchema);
