const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

async function getRegisteredUser(user){
try {
    const usersCollection = await users();
    
    const collection = await users();
    const res = await collection.findOne( {email: user});
    if(!res){
        throw `User not found`;
    }else{
        return res;
    }
    }
    catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

async function checkPassword(response, age, phoneNumber, houseNumber, street
    ,city,state,zip){

     
    // if(!username || (response.email !== username)){
    // username = username.trim();
    // username = username.toLowerCase();
    //     throw `Can not change username`;
    // }
    
    // if(!password){
    //     throw `Cannot modify password`;
    // }

    // password = password.trim();
    
    // const match = await bcrypt.compare(password, response.password);
    // if(!match){
    //     throw `Cannot modify password`;
    // }

    // if(!firstName || (response.firstName !== username)){
    //     throw `Cannot modify First Name`;
    // }

    // if(!lastName || (response.lastName !== lastName)){
    //     throw `Cannot modify First Name`;
    // }

    const dataToUpdate = {};

    dataToUpdate['age'] = age;
    dataToUpdate['phoneNumber'] = phoneNumber;

    const address = {};
    address['number'] = houseNumber;
    address["street"] = street;
    address["city"] = city;
    address["state"] = state;
    address["zip"] = zip;
    dataToUpdate["address"] = address;


    const userCollection = await users();

    var updateUser = await userCollection.updateOne({ _id:  response._id},
       { $set:  dataToUpdate });
    
    console.log("user updated from data!");

    if (updateUser.insertedCount === 0){
        throw `Could not update user`;
    }  

    return {userUpdated: true};
}

    module.exports = {
        getRegisteredUser,
        checkPassword
    };