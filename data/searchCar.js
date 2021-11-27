const { ObjectId } = require('mongodb');
const collections = require("../config/mongoCollections");
const users = collections.users;
const bookings = collections.bookings;


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



const searchByFilter = async(sourceAddress, brandName, capacity, low_rate, high_rate, zip, fromDate, toDate) => {

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
    if (fromDate && toDate) {
        const startdata_array = fromDate.split('-');
        const enddate_array = toDate.split('-');
        const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]), parseInt(startdata_array[2]))).getTime()
        const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]), parseInt(enddate_array[2]))).getTime()
        const carsToRemove = await bookingsByCar(startdate, enddate)

        data.map((user) => {
            let cars = []
            user.cars.map((car) => {
                if (!carsToRemove.has(car._id.toString())) cars.push(car)
            })
            user.cars = cars
        })
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
const bookingsByCar = async(startdate, enddate) => {
    const bookingCollection = await bookings();
    const cars = await bookingCollection.aggregate([{
        $match: {
            "bookingStatus": "APPROVED"
        }
    }, {
        $project: {
            "car.id": 1,
            "car.startdate": 1,
            "car.enddate": 1
        }
    }]).toArray();
    let carsToRemove = new Set()
    cars.map((car) => {
        if (startdate > car.car.startdate && enddate < car.car.enddate) {
            carsToRemove.add(car.car.id.toString())
        } else if (startdate < car.car.startdate && enddate > car.car.startdate) {
            carsToRemove.add(car.car.id.toString())
        } else if (startdate < car.car.enddate && enddate > car.car.enddate) {
            carsToRemove.add(car.car.id.toString())
        }
    })

    return carsToRemove
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