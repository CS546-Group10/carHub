const express = require('express');
const router = express.Router();
const getBookings = require('../data/getBookings')
const xss = require('xss');

router.get('/', async(req, res) => {
    try {
        let user = req.session.user;
        const e = req.session.userId;
        const booking1 =await getBookings.getAllByUserId(e);
        res.render('booking/bookings', { data: booking1, loginUser: true, user: user })
    } catch (e) {

    }
});
router.post('/:id', async(req, res) => {
    try {
        await getBookings.newBooking(xss(req.body.fromDate), xss(req.body.toDate), xss(req.params.id), req.session.userId)
        res.redirect('/myBookings')
    } catch (e) {
        let user = req.session.user;
        const ed = req.session.userId;
        const booking1 =await getBookings.getAllByUserId(ed);
        res.render('booking/bookings', { data: booking1, loginUser: true, user: user, error: 'You already have a booking for that car', hasErrors: true })

    }
})
module.exports = router;