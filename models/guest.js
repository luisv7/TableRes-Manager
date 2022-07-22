///// DEPENDENCIES /////
const mongoose = require('mongoose');

///// SCHEMA /////

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    time: { 
        hour: { type: Number, max: 12 },
        minute: { type: Number, max: 59 },
        meridiem: { type: String }
    },
    date: { 
        month: { type: Number },
        day: { type: Number },
        year: { type: Number },
    },
    table: { type: String },
    guests: { type: Number },
    email: { type: String },
    comments: { type: String },
});

module.exports = mongoose.model("Guest", guestSchema);
