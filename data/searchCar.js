const { ObjectId } = require('mongodb');
const collections = require("../config/mongoCollections");
const users = collections.users;
const bookings = collections.bookings;
var ObjectID = require('mongodb').ObjectID;

const searchResults = async(sourceAddress) => {
    if(!sourceAddress){
        throw `Invalid source address!`;
    }else if(sourceAddress.trim().length == 0){
        throw `source address cannot be empty!`;
    }

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

    if(sourceAddress){
        if(sourceAddress.trim().length == 0){
            throw `source address cannot be empty!`;
        }
    }

    if(brandName){
        if(brandName.trim().length == 0){
            throw `brand name cannot be empty!`;
        }
    }

    if(capacity){
        if(typeof capacity == 'string' || capacity <= 0){
            throw `Invalid capacity!`;
        }
    }

    if(low_rate){
        if(typeof low_rate == 'string'|| low_rate <= 0){
            throw `Invalid low rate!`;
        }
    }

    if(high_rate){
        if(typeof high_rate == 'string'){
            throw `Invalid high rate!`;
        }
    }

    if(fromDate && toDate){
        const startdata_array = fromDate.split('-');
        const enddate_array = toDate.split('-');
        const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]), parseInt(startdata_array[2]))).getTime()
        const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]), parseInt(enddate_array[2]))).getTime()
        const currDate = new Date();
        if(enddate < startdate){
            throw `End date cannot be less than start date!`;
        }  else if(startdate < currDate){
            throw `start date cannot be less than current date!`;
        }
    }

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
                if (car.capacity >= parseInt(capacity)) cars.push(car)
            })
            user.cars = cars
            console.log(users.cars)
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
        //const startdata_array = fromDate.split('-');
        //const enddate_array = toDate.split('-');
        //const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]), parseInt(startdata_array[2]))).getTime()
        //const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]), parseInt(enddate_array[2]))).getTime()
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

    if(!userId){
        throw `userId cannot be empty!`;
    }else if(!carId){
        throw `car Id cannot be empty!`;
    }

    if(!ObjectId.isValid(userId)){
        throw `Invalid userId!`;
    }else if(!ObjectId.isValid(carId)){
        throw `Invalid carId!`;
    }

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
const bookingsByCar = async(startdate1, enddate1) => {
    if(!startdate1 || enddate1){
        throw `starte date or end date is empty!`;
    }

    const startdata_array1 = startdate1.split('-');
    const enddate_array1 = enddate1.split('-');
    startdate1 = (new Date(parseInt(startdata_array1[0]), parseInt(startdata_array1[1]), parseInt(startdata_array1[2]))).getTime()
    enddate1 = (new Date(parseInt(enddate_array1[0]), parseInt(enddate_array1[1]), parseInt(enddate_array1[2]))).getTime()
    if(enddate1 < startdate1){
        throw `End date cannot be less than start date!`;
    }else if(startdate1 < currDate1){
        throw `start date cannot be less than current date!`;
    }

    const bookingCollection = await bookings();
    const cars = await bookingCollection.aggregate([{
        $match: {
            "bookingStatus": "APPROVED"
        }
    }, {
        $project: {
            "car._id": 1,
            "car.startdate": 1,
            "car.enddate": 1
        }
    }]).toArray();
    let carsToRemove = new Set()
    cars.map((car) => {
        if (startdate1 > car.car.startdate && enddate1 < car.car.enddate) {
            carsToRemove.add(car.car._id.toString())
        } else if (startdate1 < car.car.startdate && enddate1 > car.car.startdate) {
            carsToRemove.add(car.car._id.toString())
        } else if (startdate1 < car.car.enddate && enddate1 > car.car.enddate) {
            carsToRemove.add(car.car._id.toString())
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