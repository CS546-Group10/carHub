const express = require('express');
const router = express.Router();
const data = require('../data');
const approveCarsData = data.approvecarsdata;

const e = require('express');

router.get('/', async (req, res) => {
    title = "Approve car";

    try {
    const carArray = await approveCarsData.approveCars();
    if (carArray.length === 0) 
    {
        res.render('mycars/carApprove', { loginUser: true });
    }
    res.render('mycars/carApprove', { loginUser: true , carArray : carArray});
    } catch (e) {
        res.status(404);
        res.render('carHub/landing', { errors : e.message , hasErrors : true});
    }
});

module.exports = router;