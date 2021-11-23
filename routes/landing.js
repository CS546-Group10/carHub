const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    title = "Landing Page";
    try {
    res.render('carHub/landing', {title : title });
    } catch (e) {
        res.status(404);
        res.render('carHub/landing', { errors : e.message , hasErrors : true});
    }
});

module.exports = router;