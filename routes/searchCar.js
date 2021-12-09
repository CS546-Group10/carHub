const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;
const xss = require('xss');


router.post('/', async(req, res) => {

    const reqBody = xss(req.body);
    let sourceAddress = reqBody.sourceAddress;


    //Check sourceAddress, fromDate, toDate are provided or not
    let error = checkArgumentProvided(sourceAddress);
    if (error !== undefined) {
        throw error;
    }

    //If sourceAddress, fromDate, toDate are not strings or are empty strings, the method should throw.
    let error1 = checkArgumentIsString(sourceAddress);
    if (error1 !== undefined) {
        throw error1;
    }

    //Check string is empty or not - sourceAddress, fromDate, toDate
    let error2 = checkArgumentIsNullOrEmpty(sourceAddress);
    if (error2 !== undefined) {
        throw error2;
    }


    //Call data funtion to search the cars
    try {
        const carData = await searchCarData.searchResults(sourceAddress);
        if (req.session.userId) {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: true
            });
        } else {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: false
            });
        }

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.post('/filters', async(req, res) => {
    const { sourceAddress, brandName, capacity, low_rate, high_rate, zip, fromDate, toDate } = xss(req.body)

    try {
        const carData = await searchCarData.searchByFilter(sourceAddress, brandName, capacity, low_rate, high_rate, zip, fromDate, toDate);
        if (req.session.userId) {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: true
            });
        } else {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: false
            });
        }
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
})




function checkArgumentProvided(sourceAddress) {
    if (!sourceAddress) {
        throw new Error("Source Address parameter is not provided");
    }

}

function checkArgumentIsString(sourceAddress) {
    if (!(typeof sourceAddress == 'string')) {
        throw new Error("Source Address parameter is not string type");
    }

}

function checkArgumentIsNullOrEmpty(sourceAddress) {
    if (sourceAddress == null || sourceAddress.trim() === '') {
        throw new Error("Source Address parameter is empty");
    }

}

module.exports = router;