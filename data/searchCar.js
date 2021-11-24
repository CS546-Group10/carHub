
const {ObjectId} = require('mongodb');
const collections = require("../config/mongoCollections");
const cars = collections.cars;

//2. async getAllCars()
async function getAllCars(sourceAddress, fromDate, toDate) {
    const carCollection = await cars();

    let carInfo = {
        name: sourceAddress,
        location: fromDate,
        phoneNumber:toDate
    };

    const cars = await carCollection.findOne({carInfo});

    if (cars === null) {
        throw new Error(`No cars are present`);
    }
    return cars;
}


module.exports = {
    getAllCars
};