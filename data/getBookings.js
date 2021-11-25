const mongoCollections=require('../config/mongoCollections');
const bookings= mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const createBooking= async function createBooking(){
    var rest4={
        userId:ObjectId("619eed482dc0ace1ec53c1a4"),
        bookingStatus:'PENDING',
        car:{
            _id:ObjectId("619ee36b75748d08bfdaebda"),
            brandName:"Mercedes Benz",
            color:"White",
            number:"REW112",
            capacity:"5",
            startdate:"2021-11-27",
            enddate:"2021-11-28"
        },
        ownerId: ObjectId("619ed8de9be9091f2569ad98"),
        totalCost: 350
    }
    const bookingCollection=await bookings();
    restObj= await bookingCollection.insertOne(rest4);
}
module.exports={
    createBooking
}