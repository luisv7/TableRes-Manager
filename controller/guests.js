///// IMPORT MODEL SCHEMA /////
const Guest = require('../models/guest');
const GuestData = require('../models/guest-seed');

///// INITIALIZATION /////
const router = require('express').Router();

router.get('/seed', async (req, res) => {
    try{
        await Guest.deleteMany({});
        await Guest.create(GuestData);
        res.redirect('/guests');
    }catch (err) {
        res.send(err.message);
    }
}); 

///// ROUTES/INDUCES /////

/// INDEX
router.get('/', (req, res) => {
    Guest.find({}, (err, guests) => {
        res.render('index.ejs', { guests });
    })
})

/// NEW
router.get('/new', (req,res) => {
    res.render('new.ejs', );
});

/// DELETE

/// UPDATE - PUT

/// CREATE - POST

/// EDIT

/// SHOW

module.exports = router;