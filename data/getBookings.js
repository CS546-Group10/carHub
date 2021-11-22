const connection = require('./../config/mongoConnection');
const mongoCollections=require('../config/mongoCollections');
const bookings=mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const getAll= async function getAll(){
    const rstCollection = await bookings();
    const rstList = await rstCollection.find({}).toArray();
    return rstList;
}
const create= async function create()
{   rest1={
    "bookingStatus": "APPROVED",
    "car":{
        "brandName":"Toyota Camry",
        "color": "Blue",
        "carNumber":"ABC112",
        "capacity":2,
    }
}
    const db = await connection();
    restObj= await db.collection('bookings').insertOne(rest1);
}
const createUser= async function createUser()
{
    var rest2={
        firstName: "Saniya",
        cars:[]
    }
    const db = await connection();
    restObj= await db.collection('users').insertOne(rest2);
}
const createBooking= async function createBooking(){
    var rest4={
        userId:ObjectId("619a8b1416274c8311aa5ef4"),
        bookingStatus:'PENDING',
        car:{
            _id:ObjectId("619a973a17a3078b980823be"),
            brandName:"Alto",
            color:"Black",
            number:"SSC112",
            capacity:"5",
            startdate:"11-24-2021",
            enddate:"11-26-2021"
        }
    }
    const db = await connection();
    restObj= await db.collection('bookings').insertOne(rest4);
}
module.exports={
    getAll,
    create,
    createUser,
    createBooking,
}
