const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');


router.get('/', async(req, res) => {
    try {
        let user = req.session.user;

        res.render('booking/bookings', { data: booking1, loginUser: true ,user: user })
    } catch (e) {

    }
});


module.exports = router;