const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;

router.post('/', async(req, res) => {
    if (req.session.userId) {
        res.render('map/index', { loginUser: true })
    } else {
        res.render('map/index', { loginUser: false })
    }

})
router.post('/car', async(req, res) => {
    try {
        console.log(req.body.sourceAddress)
        const carData = await searchCarData.searchResults(req.body.sourceAddress);
        res.send(carData)
    } catch (e) {
        res.status(400).json({ error: e.message });
    }


})

module.exports = router;