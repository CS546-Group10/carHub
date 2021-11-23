const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    const reqBody = req.body;
    let sourceAddress = reqBody.sourceAddress;
    let fromDate = reqBody.fromDate;
    let toDate = reqBody.toDate;

    console.log(sourceAddress);
    console.log(fromDate);
    console.log(toDate);


    title = "Search Car";
    try {

        //add data
    res.render('carHub/landing', {title : title });
    } catch (e) {
        res.status(404);
        res.render('carHub/landing', { errors : e.message , hasErrors : true});
    }
});

module.exports = router;

