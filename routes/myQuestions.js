const express = require('express');
const router = express.Router();
const myQuestionsData = require('../data/myQuestions')

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    title = "My Questions";
    let userId = req.session.userId;
    let user = req.session.user;
    let role =  req.session.role;
    
    try {
        if(userId){
            const questions = await myQuestionsData.getQuestions(userId);
            res.render('carHub/myQuestions', {title , questions, role ,loginUser: true ,user : req.session.user,user: user});
        }else{
            res.render('carHub/landing');
        }

    } catch (e) {
        res.status(404);
        errors.push(e);
        res.render('carHub/myQuestions', { errors : errors , hasErrors : true, role, loginUser: true, user : req.session.user,user: user});
    }
});

module.exports = router;