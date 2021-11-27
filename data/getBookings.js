const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')


const newBooking = async(fromDate, toDate, carId, myId) => {
    const startdata_array = fromDate.split('-');
    const enddate_array = toDate.split('-');
    const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]), parseInt(startdata_array[2]))).getTime()
    const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]), parseInt(enddate_array[2]))).getTime()
    const ownerId = await app.map.get(carId)
    const data = await searchData.getCar_Person(ownerId, carId)
    const bookingCollection = await bookings();

    const newBook = {
        userId: ObjectId(myId),
        bookingStatus: "PENDING",
        car: {
            id: ObjectId(carId),
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
    if (insertInfo.insertedCount === 0) throw 'Could not add restaurant';
    return insertInfo
}



module.exports = {
    newBooking
}