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

const searchByFilter = async(sourceAddress, brandName, capacity, low_rate, high_rate, zip) => {

    let data = await searchResults(sourceAddress)
    if (brandName) {
        data.map((user) => {
            let cars = []
            user.cars.map((car) => {
                if (car.brandName === brandName) cars.push(car)
            })
            user.cars = cars
        })
    }
    if (capacity) {
        data.map((user) => {
            let cars = []
            user.cars.map((car) => {
                if (car.capacity === parseInt(capacity)) cars.push(car)
            })
            user.cars = cars
        })
    }
    if (low_rate && high_rate) {
        data.map((user) => {
            let cars = []
            user.cars.map((car) => {
                if (car.rate >= parseInt(low_rate) && car.rate <= parseInt(high_rate)) cars.push(car)
            })
            user.cars = cars
        })
    }
    if (zip) {
        let users_array = []
        data.map((user) => {
            if (user.address.zip === zip) {
                users_array.push(user)
            }
        })
        data = users_array
    }

    return data

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
    getCar_Person,
    searchByFilter
};