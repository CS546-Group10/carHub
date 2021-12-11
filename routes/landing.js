const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    let errors = [];
    let hasErrors = false;
    title = "Landing Page";
    let user = req.session.user;
    let role = req.session.role;
    
    try {
    if(req.session.userId){
        res.render('carHub/landing', {title : title , loginUser : true, user,role});
    }else{
        res.render('carHub/landing', {title : title ,loginUser : false});
    }
    } catch (e) {
        if(req.session.userId){
            res.status(404).render('carHub/landing', { errors : e.message , hasErrors : true,loginUser : true, user,role});
        }else{
            res.status(404).render('carHub/landing', { errors : e.message , hasErrors : true});
        }
    }
});

module.exports = router;