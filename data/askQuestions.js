const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')
const questions = mongoCollections.questions;

async function addQuestion(question,userId){

    if(!question){
        throw 'Question is not provided, Request you to provide question';
    }
    
    if (question == null || question.trim() === ''){
        throw 'Question can not be empty';
    }

    if(typeof question!=='string'){
        throw 'Question is not String type';
    }

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