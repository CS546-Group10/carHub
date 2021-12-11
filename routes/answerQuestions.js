const express = require('express');
const router = express.Router();
const answerQuestionsData = require('../data/answerQuestions')
const xss = require('xss');

router.get('/', async (req, res) => {
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;

    let title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;
    let user = req.session.user;
    try {
        if(userId){
            const questions = await answerQuestionsData.getQuestions();
            if (questions){
                res.render('carHub/answerQuestions', {title , questions, role ,loginUser: true ,role, user : user});
                return;
            }else{
                messages.push("No Questions available");
                res.render('carHub/answerQuestions', {sMessage : true, messages : messages , title , questions, role ,loginUser: true ,user : user});
                return;
            }
        } else {
            res.render('carHub/landing');
            return;
        }
    } catch (e) {
        res.status(404);
        res.render('carHub/answerQuestions', { errors : e.message , hasErrors : true , title, role ,loginUser: true, user : user});
    }
});

router.post('/:id', async (req, res) => {
    
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;

    let userId = req.session.userId;
    let role =  req.session.role;
    let user = req.session.user;

    try {
    let question = xss(req.body.question);
    let answer = xss(req.body.answer);
    let id = xss(req.params.id);
 
    if(question){
        throw `Cannot Update question`;
    }

    if (answer == null || answer.trim() === ''){
        throw `Answer cannot be empty`;
    }

    if(typeof answer !=='string'){
        throw `Answer is not String type`;
    }

    const addQuestion = await answerQuestionsData.addAnswer(answer,id);
        if(addQuestion.questionUpdated){
            const questions = await answerQuestionsData.getQuestions();
            if(questions){
                res.render('carHub/answerQuestions', {title, questions, role ,loginUser: true ,user});
                return;
            }else{
                messages.push("No Questions available");
                res.render('carHub/answerQuestions', {isMessage : true, messages, title , questions, role ,loginUser: true ,user });
                return;
            }
        }   
    } catch (e) {
        res.status(404);
        errors.push(e);
        res.render('carHub/answerQuestions', {hasErrors : true, errors , title , role ,loginUser: true ,user });
    }
});

module.exports = router;

