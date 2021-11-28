const express = require('express');
const router = express.Router();
const mongoCollections = require('./../config/mongoCollections');
const getBookings = require('../data/getBookings')

const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
router.get('/', async(req, res) => {
    try {
        let user = req.session.user;
        const e = req.session.userId;
        let parsedId = ObjectId(e);
        const bookingCollection = await bookings();
        const booking1 = await bookingCollection.find({ userId: parsedId }).toArray();

        await booking1.map((booking) => {
            booking.car.startdate = (new Date(booking.car.startdate)).toDateString()
            booking.car.enddate = (new Date(booking.car.enddate)).toDateString()
        })
        res.render('booking/bookings', { data: booking1, loginUser: true, user: user })
    } catch (e) {

    }
});
router.post('/:id', async(req, res) => {
    try {
        await getBookings.newBooking(req.body.fromDate, req.body.toDate, req.params.id, req.session.userId)
        res.redirect('/myBookings')
    } catch (e) {

        let user = req.session.user;
        const ed = req.session.userId;
        let parsedId = ObjectId(ed);
        const bookingCollection = await bookings();
        const booking1 = await bookingCollection.find({ userId: parsedId }).toArray();
        await booking1.map((booking) => {
            booking.car.startdate = (new Date(booking.car.startdate)).toDateString()
            booking.car.enddate = (new Date(booking.car.enddate)).toDateString()
        })
        res.render('booking/bookings', { data: booking1, loginUser: true, user: user, error: 'You already have a booking for that car', hasErrors: true })

    }

})
module.exports = router;