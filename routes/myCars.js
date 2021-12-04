const express = require('express');
const router = express.Router();
const myCars= require("../data/myCars")
const getBookings=require("../data/getBookings")
let { ObjectId } = require('mongodb');
const xss= require("xss");
router.get('/', async(req, res) => {
    try {
        let user = req.session.user;
        const a = req.session.userId
        const user1= await myCars.getUserById(a);
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
        let user = req.session.user;
        let brand_name = xss(req.body.brand_name);
        let color = xss(req.body.color);
        let number = xss(req.body.number);
        let capacity = xss(req.body.capacity);
        let rate = xss(req.body.rate);
        if(!brand_name)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Brand Name must be entered'});
            return;
        }
        if(!color)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Color must be entered'});
            return;
        }
        if(!number)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Number must be entered'});
            return;
        }
        if(!capacity)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Capacity must be entered'});
            return;
        }
        if(!rate)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Rate must be entered'});
            return;
        }
        if(typeof(brand_name)!='string')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid data type of Brand Name'});
            return;
        }
        if(typeof(color)!='string')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid data type of Color'});
            return;
        }
        if(typeof(number)!='string')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid data type of Number'});
            return;
        }
        if(typeof(capacity)!='string')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid data type of Capacity'});
            return;
        }
        if(typeof(rate)!='string')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid data type of Rate'});
            return;
        }
        if(typeof(parseInt(capacity))!='number')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid format of capacity'});
            return;
        }
        if(typeof(parseInt(rate))!='number')
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Invalid format of capacity'});
            return;
        }
        if(!brand_name.replace(/\s/g, '').length)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Brand Name contains only spaces'});
            return;  
        }
        if(!color.replace(/\s/g, '').length)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Color contains only spaces'});
            return;  
        }
        if(!number.replace(/\s/g, '').length)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'Number contains only spaces'});
            return;  
        }
        if(!rate.replace(/\s/g, '').length)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'rate contains only spaces'});
            return;  
        }
        if(!capacity.replace(/\s/g, '').length)
        {
            res.render('mycars/addCar', { loginUser: true, user: user, error: 'capacity contains only spaces'});
            return;  
        }
        let rest3 = {
            _id: ObjectId(),
            brandName: brand_name,
            color: color,
            number: number,
            capacity: parseInt(capacity),
            rate: parseInt(rate),
            status: "PENDING"
        }
        
        const result= await myCars.checkifCarExists(number);
        if(result){
            res.render('mycars/addCar', { loginUser: true, user: user, error:"There already exists a car registered with that number"});
        }
        else{
        const b = req.session.userId;
        var carObj = await myCars.updateById(b,rest3);
        if (carObj["modifiedCount"] == 1) {
            res.redirect('/myCar');
        }
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
        if(!isNaN(Number(id1))){
            res.status(404).json({ message: 'Invalid ID Data Type' });
            return;
          }
          var p = encodeURIComponent(id1);
          if(p.includes("%20")==true)
          {
            res.status(404).json({ message: 'ID contains spaces' });
            return;
          }
        const t = req.session.userId;
        const req1=await getBookings.pendingByCarId(id1,t)
        for (let i in req1) {
            req1[i]["_id"] = req1[i]["_id"].toString();
            req1[i]["userId"]=req1[i]["userId"].toString();
            const user2= await myCars.getUserById(req1[i]["userId"]);
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
        if(!isNaN(Number(id3))){
            res.status(404).json({ message: 'Invalid ID Data Type' });
            return;
          }
          var p = encodeURIComponent(id3);
          if(p.includes("%20")==true)
          {
            res.status(404).json({ message: 'ID contains spaces' });
            return;
          }
        var bookObj= await getBookings.updateById(id3)
        if (bookObj["modifiedCount"] == 1) {
            var book1= await getBookings.getById(id3);
            var st = book1["car"]["startdate"];
            var et = book1["car"]["enddate"];
            var book = [];
            var st1;
            var et1;
            var bookObj1;
            book1["car"]["_id"]=book1["car"]["_id"].toString();
            book= await getBookings.getpendingByCarId(book1["car"]["_id"]);
            for (let i in book) {
                st1 = book[i]["car"]["startdate"];
                et1 = book[i]["car"]["enddate"];
                if ((st1 >= st) && (et1 <= et)) {
                    bookObj1= await getBookings.updateRejectedById(book[i]["_id"]);
                } 
                else if ((st1 <= st) && (et1 >= st)) {
                    bookObj1= await getBookings.updateRejectedById(book[i]["_id"]);
                } 
                else if ((st1 <= et) && (et1 >= et)) {
                    bookObj1= await getBookings.updateRejectedById(book[i]["_id"]);
                }
            }
            res.redirect('/myCar');
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/MyRequests/:id/rejected', async(req, res) => {
    try {
        const id4 = req.params.id;
        if(!isNaN(Number(id4))){
            res.status(404).json({ message: 'Invalid ID Data Type' });
            return;
          }
          var p = encodeURIComponent(id4);
          if(p.includes("%20")==true)
          {
            res.status(404).json({ message: 'ID contains spaces' });
            return;
          }
        let parsedId = ObjectId(id4);
        var bookObj= await getBookings.updateRejectedById(parsedId);
        if (bookObj["modifiedCount"] == 1) {
            res.redirect('/myCar');
        }
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
router.get('/deleteCar/:id', async(req, res) => {

    try {
        const b = req.session.userId
        const c = req.params.id;
        if(!isNaN(Number(c))){
            res.status(404).json({ message: 'Invalid ID Data Type' });
            return;
          }
          var p = encodeURIComponent(c);
          if(p.includes("%20")==true)
          {
            res.status(404).json({ message: 'ID contains spaces' });
            return;
          }
        const user1= await myCars.deleteCar(c,b);
        if (user1["modifiedCount"] == 1) {
            getBookings.deletePending(c);
        }
        res.redirect('/myCar');
    } catch (e) {
        console.log(e);
        res.status(404).json({ "error": e })
    }
});
module.exports = router;