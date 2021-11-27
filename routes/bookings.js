const express = require('express');
const router = express.Router();
const mongoCollections=require('./../config/mongoCollections');
const bookings= mongoCollections.bookings;
let { ObjectId } = require('mongodb');
router.get('/', async (req, res) => {
    try{
        const e= req.session.userId;
        let parsedId= ObjectId(e);
        const bookingCollection= await bookings();
        const booking1 = await bookingCollection.find({ userId: parsedId}).toArray();
        for(let i in booking1)
        {
            booking1[i]["car"]["startdate"]= new Date(booking1[i]["car"]["startdate"]);
            booking1[i]["car"]["enddate"]= new Date(booking1[i]["car"]["enddate"]);
        }
        res.render('booking/bookings', {data:booking1, loginUser: true})
    }
    catch(e){

    }
});
module.exports= router;