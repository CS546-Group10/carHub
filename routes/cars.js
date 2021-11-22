const express = require('express');
const router = express.Router();
const connection = require('./../config/mongoConnection');
const mongoCollections=require('./../config/mongoCollections');
const users=mongoCollections.users;
const bookings=mongoCollections.bookings;
let { ObjectId } = require('mongodb');
router.get('/MyCars', async (req, res) => {
    try{
        const a=ObjectId("619a8b1416274c8311aa5ef4");
        const userCollection = await users();
        const user1 = await userCollection.findOne({ _id: a });
        
        for(let i in user1["cars"])
        {
            user1["cars"][i]["_id"]=user1["cars"][i]["_id"].toString();
        }
        var user2=[];//pending
        var user3=[];//approved
        for(let j in user1["cars"])
        {
            if(user1["cars"][j]["status"]== "PENDING")
            {
                user2.push(user1["cars"][j]);
            }
            if(user1["cars"][j]["status"]== "APPROVED")
            {
                user3.push(user1["cars"][j]);
            }
        }
        res.render('mycars/cars', {pending:user2, approved:user3});
    }
    catch(e){
        console.log(e);
        res.status(404).json({"error":  e})
    }
});
router.get('/addCar', async (req, res) => {
    try{
        res.render('mycars/addCar');
    }
    catch(e){
        console.log(e);
        res.status(404).json({"error":  e})
    }
});
router.post('/addCar', async (req, res) => {
    try{
        let brand_name= req.body.brand_name;
        let color= req.body.color;
        let number= req.body.number;
        let capacity= req.body.capacity;
        let start_date= req.body.start_date;
        let end_date= req.body.end_date;
        let rest3={
            _id:ObjectId(),
            brandName:brand_name,
            color:color,
            number:number,
            capacity:capacity,
            startdate:start_date,
            enddate:end_date
        }
        const b=ObjectId("619a93fe2e7fdc28f35cfbf2");
        const db = await connection();
        var carObj= await db.collection('users').updateOne({ _id: b},
        {
        $push:{cars:rest3}
        })
        if(carObj["modifiedCount"]==1)
        {
            res.redirect('/MyCars');
        }

    }
    catch(e){
        console.log(e);
        res.status(404).json({"error":  e})
    }
});
router.get('/MyRequests/:id', async (req, res) => {
    try{
        const id1= req.params.id;
        let parsedId= ObjectId(id1); 
        const db = await connection();
        const req1 = await db.collection('bookings').find({ "car._id":parsedId, "bookingStatus": "PENDING"}).toArray(); 
        console.log(req1);
        for(let i in req1){
            req1[i]["_id"]=req1[i]["_id"].toString();
        }
        res.render('request/requests', {data:req1})
    }
    catch(e){

    }
});
router.get('/Bookings', async (req, res) => {
    try{
        const e= ObjectId("619a8b1416274c8311aa5ef4");
        const db = await connection();
        const booking1 = await db.collection('bookings').find({ userId: e }).toArray();
        res.render('booking/bookings', {data:booking1})
    }
    catch(e){

    }
});
router.get('/MyRequests/:id/approved', async (req, res) => {
    try{
        const id3= req.params.id;
        let parsedId= ObjectId(id3); 
        const db = await connection();
        var bookObj= await db.collection('bookings').updateOne({ _id: parsedId},
            {
            $set:{bookingStatus:"APPROVED"}
            })
            if(carObj["modifiedCount"]==1)
            {
                res.redirect('/MyRequests');
            }
    }
    catch(e){

    }
});
router.get('/MyRequests/:id/rejected', async (req, res) => {
    try{
        const id4= req.params.id;
        let parsedId= ObjectId(id4); 
        const db = await connection();
        var bookObj= await db.collection('bookings').updateOne({ _id:parsedId},
            {
            $set:{bookingStatus:"REJECTED"}
            })
            if(bookObj["modifiedCount"]==1)
            {
                res.redirect('/MyRequests');
            }
    }
    catch(e){

    }
});
module.exports = router ;