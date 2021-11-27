const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
router.get('/', async(req, res) => {
    try {
        let user = req.session.user;
        const a = req.session.userId
        let parsedId = ObjectId(a);
        const userCollection = await users();
        const user1 = await userCollection.findOne({ _id: parsedId });
        for (let i in user1["cars"]) {
            user1["cars"][i]["_id"] = user1["cars"][i]["_id"].toString();
        }
        var user2 = []; //pending
        var user3 = []; //approved
        for (let j in user1["cars"]) {
            if (user1["cars"][j]["status"] == "PENDING") {
                user2.push(user1["cars"][j]);
            }
            if (user1["cars"][j]["status"] == "APPROVED") {
                user3.push(user1["cars"][j]);
            }
        }
        res.render('mycars/cars', { pending: user2, approved: user3, loginUser: true, user: user });
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/addCar', async(req, res) => {
    try {
        let user = req.session.user;
        res.render('mycars/addCar', { loginUser: true, user: user });
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.post('/addCar', async(req, res) => {
    try {

        let brand_name = req.body.brand_name;
        let color = req.body.color;
        let number = req.body.number;
        let capacity = req.body.capacity;
        let rate = req.body.rate;
        let rest3 = {
            _id: ObjectId(),
            brandName: brand_name,
            color: color,
            number: number,
            capacity: parseInt(capacity),
            rate: parseInt(rate),
            status: "PENDING"

        }
        const b = req.session.userId;
        let parsedId = ObjectId(b);
        const userCollection = await users();
        var carObj = await userCollection.updateOne({ _id: parsedId }, {
            $push: { cars: rest3 }
        })
        if (carObj["modifiedCount"] == 1) {
            res.redirect('/myCar');
        }

    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/MyRequests/:id', async(req, res) => {
    try {
        let user = req.session.user;

        const id1 = req.params.id;
        let parsedId = ObjectId(id1);
        const t = req.session.userId;
        let parsedId2 = ObjectId(t);
        const bookingCollection = await bookings();
        const req1 = await bookingCollection.find({ "car._id": parsedId, "bookingStatus": "PENDING", ownerId: parsedId2 }).toArray();

        let userCollection = await users();
        for (let i in req1) {
            req1[i]["_id"] = req1[i]["_id"].toString();
            const user2 = await userCollection.findOne({ "_id": req1[i]["userId"] });
            req1[i]["firstName"] = user2["firstName"];
            req1[i]["lastName"] = user2["lastName"];
            req1[i]["phoneNumber"] = user2["phoneNumber"];
        }
        res.render('request/requests', { data: req1, loginUser: true, user: user })
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })

    }
});
router.get('/MyRequests/:id/:id1/approved', async(req, res) => {
    try {

        const id3 = req.params.id1;
        let parsedId = ObjectId(id3);
        const bookingCollection = await bookings();
        var bookObj = await bookingCollection.updateOne({ _id: parsedId }, {
            $set: { bookingStatus: "APPROVED" }
        })
        if (bookObj["modifiedCount"] == 1) {
            var book1 = await bookingCollection.findOne({ "_id": parsedId });
            console.log(book1);
            var st = book1["car"]["startdate"];
            var et = book1["car"]["enddate"];
            var book = [];
            var st1;
            var et1;
            var bookObj1;
            book = await bookingCollection.find({ "car._id": book1["car"]["_id"], "bookingStatus": "PENDING" }).toArray();
            console.log(book[0]);
            for (let i in book) {
                st1 = book[i]["car"]["startdate"];
                et1 = book[i]["car"]["enddate"];
                if ((st1 > st) && (et1 < et)) {
                    bookObj1 = await bookingCollection.updateOne({ _id: book[i]["_id"] }, {
                        $set: { bookingStatus: "REJECTED" }
                    })
                } else if ((st1 < st) && (et1 > st)) {
                    bookObj1 = await bookingCollection.updateOne({ _id: book[i]["_id"] }, {
                        $set: { bookingStatus: "REJECTED" }
                    })
                } else if ((st1 < et) && (et1 > et)) {
                    bookObj1 = await bookingCollection.updateOne({ _id: book[i]["_id"] }, {
                        $set: { bookingStatus: "REJECTED" }
                    })
                }
            }

            res.redirect('/myCar/MyRequests/' + req.params.id);
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })

    }
});
router.get('/MyRequests/:id/rejected', async(req, res) => {
    try {
        const id4 = req.params.id;
        let parsedId = ObjectId(id4);
        const bookingCollection = await bookings();
        var bookObj = await bookingCollection.updateOne({ _id: parsedId }, {
            $set: { bookingStatus: "REJECTED" }
        })
        if (bookObj["modifiedCount"] == 1) {
            res.redirect('/myCar/MyRequests/' + req.params.id);
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/deleteCar/:id', async(req, res) => {

    try {
        console.log("hi");
        const b = req.session.userId
        let parsedId = ObjectId(b);
        const c = req.params.id;
        let parsedId1 = ObjectId(c);
        const userCollection = await users();
        const user1 = await userCollection.updateOne({ _id: parsedId }, {
            "$pull": {
                cars: {
                    _id: parsedId1
                }
            }

        });
        console.log(user1);
        if (user1["modifiedCount"] == 1) {
            const bookingCollection = await bookings();
            const book2 = await bookingCollection.deleteMany({ "car._id": parsedId1, bookingStatus: "PENDING" })
            console.log(book2);
        }
        res.redirect('/myCar');
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});

module.exports = router;