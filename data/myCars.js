const mongoCollections=require('../config/mongoCollections');
const users= mongoCollections.users;
const bookings= mongoCollections.bookinigs;
let { ObjectId } = require('mongodb');
const getUserById= async function getUserById(id){
    let parsedId=ObjectId(id);
    const userCollection = await users();
    const user1 = await userCollection.findOne({ _id: parsedId });
    return user1;
}
const updateById= async function updateById(id,car)
{       let parsedId = ObjectId(id);
        const userCollection = await users();
        var carObj = await userCollection.updateOne({ _id: parsedId }, {
            $push: { cars: car }
        })
        return carObj;
}
const deleteCar= async function deleteCar(carId,userId)
{   let parsedId = ObjectId(userId);
    let parsedId1 = ObjectId(carId);
    const userCollection = await users();
    const user1 = await userCollection.updateOne({ _id: parsedId }, {
        "$pull": {
            cars: {
                _id: parsedId1
            }
        }
    });
    return user1;

}
module.exports={
    getUserById,
    updateById,
    deleteCar,
}