
const { ObjectId } = require('mongodb');
const collections = require("../config/mongoCollections");
const cars = collections.cars;

const searchResults = async (sourceAddress, fromDate, toDate) => {
    const carCollection = await cars()
    const carResults = await carCollection.find({ 'address.city': sourceAddress })

    if (carResults === null) {
        throw new Error(`No cars are present`)
    }
    return carResults
}

module.exports = {
    searchResults
};