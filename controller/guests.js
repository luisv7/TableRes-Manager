///// IMPORT MODEL SCHEMA /////
const moment = require('moment');
const Guest = require('../models/guest');
const GuestData = require('../models/guest-seed');
const GuestBook = require('../models/guest-book');
const guest = require('../models/guest');
const guestBook = require('../models/guest-book');

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

/// GLOBAL VARIABLES
let UTC = moment.utc()
let today = moment(UTC).local().format('MMM Do YYYY');

// WHEN THE PHONE # OF A GUEST IS UPDATED WE NEED THIS VARIABLE TO FIND CURRENT PHONE ON SERVER GUESTBOOK AND UPDATE THE DOCUMENT WITH NEW PHONE NUMBER.
let phoneToEdit;

/// INDEX
router.get('/', (req, res) => {
    let navToday = moment().format('YYYY-MM-DD');

    Guest.find({date: navToday}, (err, guests) => {
        // ITERATE OVER EACH DOCUMENT AND CONVERT THE TIME TO STANDARD TIME
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        // RENDER NEW UPDATED COLLECTION DATA
        res.render('index.ejs', { guests, today });
    })
})

/// SEARCH BY NAME
router.get('/search', (req, res) => {
    let searchedName = req.query.name;
    searchedName = searchedName.charAt(0).toUpperCase() + searchedName.slice(1);
    
    Guest.find({ 'name.first': searchedName }, (err, guests) => {
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        res.render('index.ejs', { guests, today })
    });
})

/// FILTER BY DATE & TIME
router.get('/filter-date-and-time', (req, res) => {
    let filterTime = req.query.time;
    let filterDate = req.query.date;

    if(filterTime !== '' && filterDate !== ''){
        Guest.find({ time: filterTime, date: filterDate }, (err, guests) => {
            guests.forEach((el) => {
                el.time = moment(el.time, 'HH:mm').format('h:mm A');
                el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
            });
            res.render('index.ejs', { guests, today })
        });
    }else if(filterDate !== ''){
        Guest.find({ date: filterDate }, (err, guests) => {
            guests.forEach((el) => {
                el.time = moment(el.time, 'HH:mm').format('h:mm A');
                el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
            });
            res.render('index.ejs', { guests, today })
        });
    }else if(filterTime !== ''){
        Guest.find({ time: filterTime}, (err, guests) => {
            guests.forEach((el) => {
                el.time = moment(el.time, 'HH:mm').format('h:mm A');
                el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
            });
            res.render('index.ejs', { guests, today })
        });
    }
})

// FILTER VIEW ALL
router.get('/view-all', (req, res) => {
    Guest.find({}, (err, guests) => {
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        res.render('index.ejs', { guests, today })
    });
})

/// NEW
router.get('/new', (req,res) => {
    let guest = req.query;
    res.render('new.ejs', { guest, today });
});

/// DELETE
router.delete('/:id', (req, res) => {
    Guest.findByIdAndDelete(req.params.id, req.body, () => {
        res.redirect('/guests');
    });
});

/// UPDATE - PUT
router.put('/:id', (req, res) => {
    let body = req.body;

    Guest.findByIdAndUpdate(req.params.id, req.body, () => {
        res.redirect(`/guests/filter-date-and-time?date=${req.body.date}&time=${req.body.time}`);
    });

    // FIND OLD PHONE # AND UPDATE BODY 
    if(phoneToEdit !== req.body.phone){
        GuestBook.find({ phone: phoneToEdit }, (err, guestBook) => {
            GuestBook.findByIdAndUpdate(guestBook[0]._id, req.body, () => {
            });
        });
    }else{
        GuestBook.find({ phone: phoneToEdit }, (err, guestBook) => {
            GuestBook.findByIdAndUpdate(guestBook[0]._id, body, () => {
            });
        });
    }
});

/// CREATE - POST
router.post('/', (req, res) => {
    // CAPITALIZE FIRST NAME
    let firstName = req.body['name.first'];
    req.body['name.first'] = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    Guest.create(req.body);
    GuestBook.find({ phone: req.body.phone }, (err, guest) => {
        if(guest == ""){
            GuestBook.create(req.body);
        }
    });
    res.redirect('/guests');
});

/// EDIT
router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
    Guest.findById(id , (err, guest) => {
        // PHONE NUMBER USED TO FILTER GUESTBOOK AND UPDATE
        phoneToEdit = guest.phone;
        res.render('edit.ejs', { id, guest, today });
    });
});


///// GUEST BOOK /////

/// GUEST BOOK
router.get('/guest-book', (req, res) => {
    GuestBook.find({}, (err, guestBook) => {
        res.render('guest-book.ejs', { guestBook, today });
    })
})

/// GUEST BOOK DELETE
router.delete('/guest-book/:id', (req, res) => {
    GuestBook.findByIdAndDelete( req.params.id, req.body, () => {
        res.redirect('/guests/guest-book')
    })
})

/// GUEST BOOK EDIT
router.get('/guest-book/:id/edit', (req, res) => {
    let id = req.params.id;
    GuestBook.findById(id, (err, guest) => {
        res.render('guest-book-edit.ejs', { id , guest, today });
    });
})

module.exports = router;