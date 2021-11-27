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
    try {
        const usersCollection = await users();
        let arr = await usersCollection.find().toArray();
        if (arr === null)  {
            throw new Error("Data is not available");
        }
        var pendingCars = [];//pending
        for(const element of arr){
            for(const ele of element["cars"]){
                if(ele._id.toString() === id){
                    let parsedId = ObjectId(id);
                    const carObj = await usersCollection.findOne({ 'car._id': parsedId },{$set: { status: buttonClicked }});
                    if(carObj["modifiedCount"] == 1) {
                        res.redirect('/myCar/MyRequests/'+req.params.id);
                    }else{
                        throw new Error("There is no car in pending status"); 
                    }
                    const carArray = await approveCarsData.getPendingCars();
                    if (carArray.length === 0) 
                    {
                        throw new Error("There is no car in pending status");
                    }
                    else{
                        return carArray;
                    }
                }
            }
        }
    }catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }


module.exports = {
    approveOrRejectCar,
    getPendingCars
};