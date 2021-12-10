const express = require('express');
const router = express.Router();
const faqQuestionsData = require('../data/faqQuestions')

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    title = "FAQ";
    let user = req.session.user;
    let role =  req.session.role;
    try {
        const questions = await faqQuestionsData.getQuestions();
        res.render('carHub/faq', {title , questions, role ,loginUser: false });
    } catch (e) {
        res.status(404);
        res.render('carHub/faq', {errors : e.message , hasErrors : true, title,loginUser: false});
    }
});

module.exports = router;