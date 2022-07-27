///// DEPENDENCIES /////
const mongoose = require('mongoose');

///// SCHEMA /////

const guestSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true},
        last: { type: String },
     },
    phone: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    table: { type: String },
    guests: { type: Number, maxLength: 3, require: true },
    email: { type: String },
    comments: { type: String },
});

module.exports = mongoose.model("Guest", guestSchema);
