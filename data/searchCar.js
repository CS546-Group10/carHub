const { ObjectId } = require('mongodb');
const collections = require("../config/mongoCollections");
const users = collections.users;

const searchResults = async(sourceAddress) => {
    const userCollectios = await users()
    const carResults = await userCollectios.aggregate([{
        $match: {
            "address.city": sourceAddress
        }
    }, {
        $project: {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            address: 1,
            email: 1,
            cars: {
                $filter: {
                    input: "$cars",
                    as: "car",
                    cond: { $eq: ["$$car.status", "APPROVED"] }
                }
            }
        }
    }]).toArray()

    if (carResults === null) {
        throw new Error(`No cars are present`)
    }
    return carResults
}

const getCar_Person = async(userId, carId) => {
    const userCollectios = await users()
    const person = await userCollectios.aggregate([{
        $match: {
            "_id": ObjectId(userId)
        }
    }, {
        $project: {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            address: 1,
            email: 1,
            cars: {
                $filter: {
                    input: "$cars",
                    as: "car",
                    cond: { $eq: ["$$car._id", ObjectId(carId)] }
                }
            }
        }
    }]).toArray()

    if (person === null) {
        throw new Error(`No cars are present`)
    }
    return person
}

const carToOwner = async(map) => {
    const userCollectios = await users()
    const carResults = await userCollectios.find({}).toArray()
    await carResults.map((user) => {
        user.cars.map((c) => {
            map.set(c._id.toString(), user._id.toString())
        })
    })
    return map
}

module.exports = {
    searchResults,
    carToOwner,
    getCar_Person
};