///// IMPORT MODEL SCHEMA /////
const moment = require('moment');
const Guest = require('../models/guest');
const GuestData = require('../models/guest-seed');

///// INITIALIZATION /////
const router = require('express').Router();

/////FUNCTIONS ///// 
function filter(selectedDate){
    return selectedDate.slice(5,15);
}

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

// GLOBAL VARIABLES
let today = moment().format('MMM Do YYYY');


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
    let searchName = req._parsedOriginalUrl.query.slice(5);
    searchName = searchName.charAt(0).toUpperCase() + searchName.slice(1);
    
    Guest.find({ 'name.first': searchName }, (err, guests) => {
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        res.render('index.ejs', { guests, today })
    });
})

/// FILTER BY DATE
router.get('/filter-by-date', (req, res) => {
    // RETURNS DATE SELECTED ON NAV CALENDAR
    let filteredDate = filter(req._parsedOriginalUrl.query);
    Guest.find({ date: filteredDate }, (err, guests) => {
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        res.render('index.ejs', { guests, today })
    });
})

/// FILTER BY TIME
router.get('/filter-by-time', (req, res) => {
    let filterTime = filter(req._parsedOriginalUrl.query);
    filterTime = `${filterTime.slice(0,2)}:${filterTime.slice(5,7)}`;
    Guest.find({ time: filterTime }, (err, guests) => {
        guests.forEach((el) => {
            el.time = moment(el.time, 'HH:mm').format('h:mm A');
            el.date = moment(el.date, 'YYYY-MM-DD').format('MMM Do YYYY');
        });
        res.render('index.ejs', { guests, today })
    });
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
    res.render('new.ejs', { today });
});

/// DELETE
router.delete('/:id', (req, res) => {
    Guest.findByIdAndDelete(req.params.id, req.body, () => {
        res.redirect('/guests');
    });
});

/// UPDATE - PUT
router.put('/:id', (req, res) => {
    Guest.findByIdAndUpdate(req.params.id, req.body, () => {
        res.redirect('/guests');
    });
});

/// CREATE - POST
router.post('/', (req, res) => {
    // CAPITALIZE FIRST NAME
    let firstName = req.body['name.first'];
    req.body['name.first'] = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    Guest.create(req.body);
    res.redirect('/guests');
});

/// EDIT
router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
    Guest.findById(id , (err, guest) => {
        res.render('edit.ejs', { id, guest, today });
    });
});

/// SHOW

module.exports = router;