const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
router.get('/', async (req, res) => {
    try {
        const a = req.session.userId
        let parsedId = ObjectId(a);
        const userCollection = await users();
        const user1 = await userCollection.findOne({ _id: parsedId });

        for (let i in user1["cars"]) {
            user1["cars"][i]["_id"] = user1["cars"][i]["_id"].toString();
        }
        var user2 = [];//pending
        var user3 = [];//approved
        for (let j in user1["cars"]) {
            if (user1["cars"][j]["status"] == "PENDING") {
                user2.push(user1["cars"][j]);
            }
            if (user1["cars"][j]["status"] == "APPROVED") {
                user3.push(user1["cars"][j]);
            }
        }
        res.render('mycars/cars', { pending: user2, approved: user3, loginUser: true });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/addCar', async (req, res) => {
    try {
        res.render('/addCar', { loginUser: true });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.post('/addCar', async (req, res) => {
    try {
        let brand_name = req.body.brand_name;
        let color = req.body.color;
        let number = req.body.number;
        let capacity = req.body.capacity;
        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let rest3 = {
            _id: ObjectId(),
            brandName: brand_name,
            color: color,
            number: number,
            capacity: capacity,
            startdate: start_date,
            enddate: end_date,
            status: "PENDING"
        }
        const b = req.session.userId;
        let parsedId = ObjectId(b);
        const db = await connection();
        var carObj = await db.collection('usersCreds').updateOne({ _id: parsedId },
            {
                $push: { cars: rest3 }
            })
        if (carObj["modifiedCount"] == 1) {
            res.redirect('/myCar');
        }

    }
    catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/MyRequests/:id', async (req, res) => {
    try {
        const id1 = req.params.id;
        let parsedId = ObjectId(id1);
        const db = await connection();
        const req1 = await db.collection('bookings').find({ "car._id": parsedId, "bookingStatus": "PENDING" }).toArray();
        const users1 = [];
        for (let i in req1) {
            req1[i]["_id"] = req1[i]["_id"].toString();
            user1.push(await db.collection('users').find({ "_id": req1[i]["userId"] }));
        }
        res.render('request/requests', {})
    }
    catch (e) {

    }
});
router.get('/MyRequests/:id/approved', async (req, res) => {
    try {
        const id3 = req.params.id;
        let parsedId = ObjectId(id3);
        const db = await connection();
        var bookObj = await db.collection('bookings').updateOne({ _id: parsedId },
            {
                $set: { bookingStatus: "APPROVED" }
            })
        if (carObj["modifiedCount"] == 1) {
            res.redirect('/MyRequests');
        }
    }
    catch (e) {

    }
});
router.get('/MyRequests/:id/rejected', async (req, res) => {
    try {
        const id4 = req.params.id;
        let parsedId = ObjectId(id4);
        const db = await connection();
        var bookObj = await db.collection('bookings').updateOne({ _id: parsedId },
            {
                $set: { bookingStatus: "REJECTED" }
            })
        if (bookObj["modifiedCount"] == 1) {
            res.redirect('/MyRequests');
        }
    }
    catch (e) {

    }
});

module.exports = router;