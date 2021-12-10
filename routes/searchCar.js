const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;
const xss = require('xss');


router.post('/', async(req, res) => {

    const reqBody = xss(req.body.sourceAddress);
    let sourceAddress = reqBody;
    //Call data funtion to search the cars
    try {
        if (!sourceAddress) {
            throw `Invalid City!`;
        } else if (sourceAddress.trim().length == 0) {
            throw `source address cannot be empty!`;
        }

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
        let errors = []
        errors.push(e)
        if (req.session.userId) {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: true,
                errors,
                hasErrors: true
            });
        } else {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: false,
                errors,
                hasErrors: true
            });
        }
    }
});

router.post('/filters', async(req, res) => {
    const { sourceAddress, brandName, capacity, low_rate, high_rate, zip, fromDate, toDate } = xss(req.body)

    try {
        if (sourceAddress) {
            if (sourceAddress.trim().length == 0) {
                throw `source address cannot be empty!`;
            }
        }

        if (brandName) {
            if (brandName.trim().length == 0) {
                throw `brand name cannot be empty!`;
            }
        }

        if (capacity) {
            if (typeof capacity == 'string' || capacity <= 0) {
                throw `Invalid capacity!`;
            }
        }

        if (low_rate) {
            if (typeof low_rate == 'string' || low_rate <= 0) {
                throw `Invalid low rate!`;
            }
        }

        if (high_rate) {
            if (typeof high_rate == 'string') {
                throw `Invalid high rate!`;
            }
        }

        if (fromDate && toDate) {
            const startdata_array = fromDate.split('-');
            const enddate_array = toDate.split('-');
            const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]), parseInt(startdata_array[2]))).getTime()
            const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]), parseInt(enddate_array[2]))).getTime()
            const currDate = new Date();
            if (enddate < startdate) {
                throw `End date cannot be less than start date!`;
            } else if (startdate < currDate) {
                throw `start date cannot be less than current date!`;
            }
        }

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