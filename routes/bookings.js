const express = require('express');
const router = express.Router();
const connection = require('./../config/mongoConnection');
const mongoCollections=require('./../config/mongoCollections');
let { ObjectId } = require('mongodb');
router.get('/myBookings', async (req, res) => {
    try{
        const e= req.session.userId;
        let parsedId= ObjectId(e);
        const db = await connection();
        const booking1 = await db.collection('bookings').find({ userId: parsedId }).toArray();
        res.render('booking/bookings', {data:booking1})
    }
    catch(e){

    }
});
module.exports= router;