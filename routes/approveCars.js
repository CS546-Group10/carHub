const express = require('express');
const router = express.Router();
const data = require('../data');
const approveCarsData = data.approvecarsdata;
const xss = require('xss');

const e = require('express');

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let user = req.session.user;

    const title = "Approve car";
    try {
        const carArray = await approveCarsData.getPendingCars();
        if (carArray.length === 0) {
            errors.push("Data is not available");
            res.render('mycars/carApprove', { loginUser: true, errors: errors, hasErrors: true, user: user ,role : req.session.role});
            return;
        }
        res.render('mycars/carApprove', { loginUser: true, carArray: carArray, user: user ,role : req.session.role});
    } catch (e) {
        res.status(404);
        errors.push(e.message);
        res.render('mycars/carApprove', { errors: errors, hasErrors: true, user: user ,role : req.session.role});
    }
});


router.post('/:id', async(req, res) => {
    let errors = [];
    let hasErrors = false;
    let user = req.session.user;

    try {
        const reqBody = xss(req.body);
        const { Approved, Rejected } = reqBody;
        const id = xss(req.params.id);
        let adminEmailAddress = req.session.emailAddress;

        //Check that the ID is provided or not
        if (!id) {
            errors.push("Id parameter is not provided");
        }

        //Check that the username and password are string type or not
        if (!(typeof id == 'string')) {
            errors.push("Id parameter is not string type");
        }

        //Check that the username and password is empty or not
        if (id == null || id.trim() === '') {
            errors.push("Id parameter is empty");
        }

        //Check that the username and password contains spaces or not(Between)
        if ((/\s/).test(id)) {
            errors.push("Id parameter contains spaces");
        }

        //Id length should be equal to
        if (id.length !== 24) {
            errors.push("Username parameter is less than 4 character length");
        }

        let buttonClicked = null;
        if(Approved == ''){
            buttonClicked = "APPROVED";
        }else if(Rejected == ''){
            buttonClicked = "REJECTED";
        }else{
            errors.push("Invalid Id");
            res.status(404);
            res.render('mycars/carApprove', { errors: errors, hasErrors: true, user: user,role : req.session.role });
        }

        const carArray = await approveCarsData.approveOrRejectCar(id, buttonClicked,adminEmailAddress);
        if (carArray.length === 0) {
            errors.push("Data is not available");
            res.render('mycars/carApprove', { loginUser: true, errors: errors, hasErrors: true, user: user ,role : req.session.role});
            return;
        }
        res.render('mycars/carApprove', { loginUser: true, carArray: carArray, user: user ,role : req.session.role});
    } catch (e) {
        errors.push(e);
        res.status(404);
        res.render('mycars/carApprove', { errors: errors, hasErrors: true, user: user ,role : req.session.role});
    }
});

module.exports = router;