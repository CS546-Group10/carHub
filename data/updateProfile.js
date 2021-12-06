const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

async function getRegisteredUser(user){
try {
    const usersCollection = await users();
    
    const collection = await users();
    const res = await collection.findOne( {email: user});
    if(!res){
        throw `Either the username or password is invalid!`;
    }else{
        return res;
    }
    }
    catch (e) {
        console.log(e);
        throw new Error(e);
    }
}


    module.exports = {
        getRegisteredUser
    };