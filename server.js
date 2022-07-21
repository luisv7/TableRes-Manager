///// DEPENDENCIES /////
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Guest = require('./controller/guests');

///// INITIALIZATION /////
const app = express();
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL);
mongoose.connection.on('connected', () => {
    console.log('connected to MongoDB')
});

///// MIDDLEWARE /////
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

///// ROUTES /////
app.get('/', (req, res) => {
});

app.get('/guests', Guest)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});