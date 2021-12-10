const express = require('express');
const router = express.Router();
const askQuestionsData = require('../data/answerQuestions')
const xss = require('xss');

router.get('/', async (req, res) => {
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;

    title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;
    try {
        if(userId){
            const questions = await askQuestionsData.getQuestions();
            console.log(questions);
            if (questions.length !== 0 ){
                res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,user : req.session.user});
                return;
            }else{
                messages.push("No Questions available");
                res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,user : req.session.user,isMessage : true, messages : messages });
                return;
            }
            res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,user : req.session.user});
        } else {
            res.render('carHub/landing', {loginUser: false});
        }
    } catch (e) {
        res.status(404);
        res.render('carHub/answerQuestions', { errors : e.message , hasErrors : true,role,loginUser: true, user : req.session.user});
    }
});

router.post('/:id', async (req, res) => {
    title = "Answer Questions";
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;
    let userId = req.session.userId;
    let role =  req.session.role;

    try {
    let question = xss(req.body.question);
    let answer = xss(req.body.answer);
    let id = xss(req.params.id);
 
    if(question){
        throw `Cannot Update question`;
    }
    if(!userId){
        res.render('carHub/answerQuestions', {loginUser: false});
    }

    const addQuestion = await askQuestionsData.addAnswer(answer,id);
    if(addQuestion.questionUpdated){
        const questions = await askQuestionsData.getQuestions();
        if(questions !== 0 ){
            messages.push("No Questions available");
            res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,user : req.session.user,isMessage : true, messages : messages });
        }
        res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,user : req.session.user});
    }else{
        res.render('carHub/answerQuestions', {title : title });
    }
    } catch (e) {
        res.status(404);
        res.render('carHub/answerQuestions', { errors : e.message , hasErrors : true});
    }
});

module.exports = router;

