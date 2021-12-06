const express = require('express');
const router = express.Router();
const data = require('../data');
const updateprofiledata = data.updateprofiledata;
const e = require('express');

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let user = req.session.user;

    const response = await updateprofiledata.getRegisteredUser(user);
    try {
        res.render('login/updateProfile.handlebars', { loginUser: true,user: user ,role : req.session.role , response : response});
    }catch (e) {
        res.render('login/updateProfile.handlebars', { errors: errors, hasErrors: true, user: user ,role : req.session.role});
    }
});


router.post('/:id', async(req, res) => {
    
});

module.exports = router;