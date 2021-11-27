const mongoCollections=require('../config/mongoCollections');
const bookings= mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const createBooking= async function createBooking(){
    var st = new Date(2021, 11, 07, 22, 00, 00, 00);
    var et=new Date(2021, 11, 11, 22, 00, 00, 00);
    var rest4={
        userId:ObjectId("619f0990b492c804d5fb14cb"),
        bookingStatus:'PENDING',
        car:{
            _id:ObjectId("619ee27075748d08bfdaebd9"),
            brandName:"Toyota Corolla",
            color:"White",
            number:"ZKJ113",
            capacity:"5",
            status:"APPROVED",
            rate:10,
            startdate:st.getTime(),
            enddate:et.getTime()
        },
        ownerId: ObjectId("619ed8de9be9091f2569ad98"),
        totalCost: 350
    }
    console.log(rest4.car.startdate +typeof(rest4.car.startdate));
    const bookingCollection=await bookings();
    restObj= await bookingCollection.insertOne(rest4);
}
module.exports={
    createBooking
}