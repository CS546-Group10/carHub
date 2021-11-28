const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

async function getPendingCars(){
try {
    const usersCollection = await users();
    
    let arr = await usersCollection.find().toArray();
    if (arr === null)  {
        throw new Error("Data is not available");
    }
    var pendingCars = [];//pending
    for(const element of arr){
        for(const ele of element["cars"]){
                if (ele["status"] == "PENDING") {
                    pendingCars.push(ele);
                }
        }
    }
    return pendingCars;
    }
    catch (e) {
        console.log(e);
        throw new Error(e);
    }
}


async function approveOrRejectCar(id,buttonClicked){
        const usersCollection = await users();
        let arr = await usersCollection.find().toArray();
        if (arr === null)  {
            throw new Error("Data is not available");
        }
        var pendingCars = [];//pending
        let userId = null;
        for(const element of arr){
            userId = element._id;
            for(const ele of element["cars"]){
                if(ele._id.toString() === id){
                    const carObj = await usersCollection.updateOne({ '_id' : userId, 'cars._id': ele._id },{$set: { 'cars.$.status': buttonClicked }});
                    if(carObj["modifiedCount"] == 1) {
                        const carArray = await getPendingCars();
                        if (carArray.length === 0) 
                        {
                            throw new Error("There is no car in pending status");
                        }
                        else{
                            return carArray;
                        }                    
                    }else{
                        throw new Error("There is no car in pending status"); 
                    }

                }
            }
        }
    }


module.exports = {
    approveOrRejectCar,
    getPendingCars
};