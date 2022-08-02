///// DEPENDENCIES /////
const mongoose = require('mongoose');

///// SCHEMA /////

const guestBookSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true},
        last: { type: String },
     },
    phone: { type: String, required: true },
    email: { type: String },
});

module.exports = mongoose.model("GuestBook", guestBookSchema);
