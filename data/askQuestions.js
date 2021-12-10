const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')
const questions = mongoCollections.questions;

async function addQuestion(question,userId){
    const quest = {
        userId : userId,
        question : question,
        status : 'PENDING'
    };

    const questionCollection = await questions();
    const updateQuestions = await questionCollection.insertOne(quest);
    if (updateQuestions.acknowledged){
        return {questionUpdated: true};
    }else{
        throw `Could not update question`;
    }
}


module.exports={
    addQuestion
}