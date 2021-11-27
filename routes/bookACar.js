const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('../data/searchCar')


router.get('/:id', async(req, res) => {
    try {
        const userId = await app.map.get(req.params.id)
        const data = await searchData.getCar_Person(userId, req.params.id)
        const car = {
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            email: data[0].email,
            phoneNumber: data[0].phoneNumber,
            address: data[0].address,
            brandName: data[0].cars[0].brandName,
            color: data[0].cars[0].color,
            number: data[0].cars[0].number,
            status: data[0].cars[0].status,
            rate: data[0].cars[0].rate,
            capacity: data[0].cars[0].capacity
        }
        res.render('bookACar/index', { loginUser: true, car })
    } catch (e) {

    }
});


module.exports = router;