const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
let { ObjectId } = require('mongodb');

/*question
1. faqQuestion
2. answers
3. status
*/

async function getQuestions(){

    try{
        const questionCollection = await questions();
        const getQuestions = await questionCollection.find({status : 'PENDING'}).toArray();
        return getQuestions;
    }catch(e){
        throw `Internal Server Error`;
   }

    // if (getQuestions.acknowledged){
    //     return getQuestions;
    // }else{
    //     throw `Question are not in pending status`;
    // }  
}

async function addAnswer(answer,id){
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