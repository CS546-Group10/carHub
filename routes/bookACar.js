const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');


router.get('/', async(req, res) => {
    try {

        res.render('booking/bookings', { data: booking1, loginUser: true })
    } catch (e) {

    }
});


module.exports = router;