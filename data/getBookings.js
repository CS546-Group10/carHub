const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')


const newBooking = async(fromDate, toDate, carId, myId) => {

    const startdata_array = fromDate.split('-');
    const enddate_array = toDate.split('-');
    const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
    const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
    const ownerId = await app.map.get(carId)
    const data = await searchData.getCar_Person(ownerId, carId)
    const bookingCollection = await bookings();
    let set = await approvedBookings(carId, startdate, enddate)
    if (set.size > 0) {
        throw data[0].address.city
    }
    const newBook = {

        userId: ObjectId(myId),
        bookingStatus: "PENDING",
        car: {
            _id: ObjectId(carId),
            brandName: data[0].cars[0].brandName,
            color: data[0].cars[0].color,
            number: data[0].cars[0].number,
            capacity: data[0].cars[0].capacity,
            status: data[0].cars[0].status,
            rate: data[0].cars[0].rate,
            startdate,
            enddate
        },
        ownerId: ObjectId(ownerId),
        totalCost: enddate === startdate ? parseInt(data[0].cars[0].rate) : ((enddate - startdate) / (1000 * 3600 * 24)) * data[0].cars[0].rate,
        creationDate: (new Date()).getTime()
    }
    const insertInfo = await bookingCollection.insertOne(newBook)
    if (insertInfo.insertedCount === 0) throw 'Could not add booking';
    return insertInfo
}

const approvedBookings = async(carId, startdate, enddate) => {
    const bookingCollection = await bookings();
    const cars = await bookingCollection.aggregate([{
        $match: {
            "bookingStatus": "APPROVED",
            "car._id": ObjectId(carId),
        }
    }, {
        $project: {
            "car._id": 1,
            "car.startdate": 1,
            "car.enddate": 1
        }
    }]).toArray();

    let approvedBooking = new Set()

    cars.map((car) => {
        if (startdate > car.car.startdate && enddate < car.car.enddate) {
            approvedBooking.add(car.car._id.toString())
        } else if (startdate <= car.car.startdate && enddate > car.car.startdate) {
            approvedBooking.add(car.car._id.toString())
        } else if (startdate <= car.car.enddate && enddate > car.car.enddate) {
            approvedBooking.add(car.car._id.toString())
        }
    })
    return approvedBooking

}



module.exports = {
    newBooking
}