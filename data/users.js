const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.usersCreds;
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function createUser(username, password){
    if(!username || !password){
        throw `Username or Password cannot be empty!`;
    }

    username = username.trim();
    username = username.toLowerCase();
    password = password.trim();

    if(typeof username!=='string' || username.length < 4 || username.indexOf(' ') >= 0){
        throw `Invalid Username!`;
    }

    if(password.indexOf(' ') >=0 || password.length<6){
        throw `Invalid password!`;
    }
    const collection = await users();
    const res = await collection.findOne( {username: username});
    if(res){
        throw `This username already present in the system!`;
    }

    const dataToInsert = {};
    dataToInsert['username']=username;
    const hashPass = await bcrypt.hash(password, saltRounds);
    dataToInsert['password']=hashPass;

    const userCollection = await users();

    const insertInfo = await userCollection.insertOne(dataToInsert);

    console.log("user created from data!");

    if (insertInfo.insertedCount === 0){
        throw `Could not add user`;
    }  

    return {userInserted: true};
}

async function checkUser(username, password){
    if(!username || !password){
        throw `Username or Password cannot be empty!`;
    }

    username = username.trim();
    username = username.toLowerCase();
    password = password.trim();

    if(typeof username!=='string' || username.length < 4 || username.indexOf(' ') >= 0){
        throw `Invalid Username!`;
    }

    if(password.indexOf(' ') >=0 || password.length<6){
        throw `Invalid password!`;
    }
    const collection = await users();
    const res = await collection.findOne( {username: username});
    if(!res){
        throw `Either the username or password is invalid!`;
    }

    const match = await bcrypt.compare(password, res.password);
    if(match){
        return {authenticated: true};
    }

    throw `Either the username or password is invalid!`;
}

module.exports = {
    createUser,
    checkUser
}