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

module.exports = {
    searchResults
};