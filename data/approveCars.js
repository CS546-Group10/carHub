const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

async function approveCars(){
try {

    const usersCollection = await users();
    let carArray = [];
    
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


module.exports = {
    approveCars
};