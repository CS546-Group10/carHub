const connection = require('./../config/mongoConnection');
const mongoCollections=require('../config/mongoCollections');
const bookingCollection= mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const createBooking= async function createBooking(){
    var rest4={
        userId:ObjectId("619e945a5c0e7063d435e2a5"),
        bookingStatus:'PENDING',
        car:{
            _id:ObjectId("619e70f4f7e5445e30303175"),
            brandName:"Alto",
            color:"Black",
            number:"SSC112",
            capacity:"5",
            startdate:"11-24-2021",
            enddate:"11-26-2021"
        },
        ownerId: ObjectId("619e563e406f7a56508c4505")
    }
    const db = await connection();
    restObj= await bookingCollection.insertOne(rest4);
}
module.exports={
    createBooking
}