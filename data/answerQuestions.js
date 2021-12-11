const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
let { ObjectId } = require('mongodb');

async function getQuestions(){

    try{
        const questionCollection = await questions();
        const getQuestions = await questionCollection.find({status : 'PENDING'}).toArray();
        return getQuestions;
    }catch(e){
        throw `Internal Server Error`;
   }
}

async function addAnswer(answer,id){

    if(question){
        throw `Cannot Update question`;
    }

    if (answer.val() == null || answer.val().trim() === ''){
        throw `Answer cannot be empty`;
    }

    if(typeof answer !=='string'){
        throw `Answer is not String type`;
    }

    const quest = {
        answer : answer,
        status : 'COMPLETED'
    };

    const questionCollection = await questions();
    var updateUser = await questionCollection.updateOne({ _id: ObjectId(id)},
        { $set:  quest });

        if (updateUser.modifiedCount !== 1){
            throw `Could not update question`;
        }  

    return {questionUpdated: true};
}


module.exports={
    getQuestions,
    addAnswer
}