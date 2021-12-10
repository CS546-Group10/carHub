const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');
const app = require('../app');
const askQuestionsData = require('../data/askQuestions')
const xss = require('xss');

router.get('/', async (req, res) => {
    title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;
    try {
        if(userId){
            res.render('carHub/askQuestions', {title : title , role : role ,loginUser: true,user : req.session.user});
        } else {
            res.render('carHub/landing', {loginUser: false});
        }
    } catch (e) {
        res.status(404);
        res.render('carHub/askQuestions', { errors : e.message , hasErrors : true,user : req.session.user});
    }
});

router.post('/', async (req, res) => {
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;

    title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;

    try {
    let question = xss(req.body.question);
    if(!question){
        throw 'Question can not be empty';
    }
    
    const addQuestion = await askQuestionsData.addQuestion(question,userId);

    if(!userId){
        res.render('carHub/askQuestions', {loginUser: false});
    }

    if(addQuestion.questionUpdated){
        messages.push("Wait for reply");
        res.render('carHub/askQuestions', {title : title , role : role ,loginUser: true,user : req.session.user , isMessage : true, messages : messages});
    }else{
        res.render('carHub/askQuestions', {title : title });
    }
    } catch (e) {
        res.status(404);
        errors.push(e.message);
        res.render('carHub/askQuestions', { errors : errors , hasErrors : true});
    }
});

module.exports = router;

