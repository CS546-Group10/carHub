const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;


router.post('/', async (req, res) => {

    const reqBody = req.body;
    let sourceAddress = reqBody.sourceAddress;
    let fromDate = reqBody.fromDate;
    let toDate = reqBody.toDate;

     //Check sourceAddress, fromDate, toDate are provided or not
     let error = checkArgumentProvided(sourceAddress, fromDate, toDate);
     if(error !== undefined){
         throw error;
     }
 
     //If sourceAddress, fromDate, toDate are not strings or are empty strings, the method should throw.
     let error1 = checkArgumentIsString(sourceAddress, fromDate, toDate);
     if(error1 !== undefined){
         throw error1;
     }
 
     //Check string is empty or not - sourceAddress, fromDate, toDate
     let error2 = checkArgumentIsNullOrEmpty(sourceAddress, fromDate, toDate);
     if(error2 !== undefined){
         throw error2;
     }
     
    //If dateOfReview is not a valid date string, the method will throw. //it must be MM/DD/YYYY
    let fromdate = new Date(fromDate);
    if (Object.prototype.toString.call(fromdate) === "[object Date]") {
      if (isNaN(fromdate.getTime())) {
        res.status(400).json({ message: 'From Date should be a valid date format.'});
        return;
      } 
    }  
    
    let todate = new Date(toDate);
    if (Object.prototype.toString.call(todate) === "[object Date]") {
      if (isNaN(todate.getTime())) {
        res.status(400).json({ message: 'To Date should be a valid date format.'});
        return;
      } 
    }

   //Call data funtion to search the cars
   try {
    const carData = await searchCarData.getAllCars(sourceAddress, fromDate, toDate);
    res.status(200).json(carData);
  } catch (e) {
    res.status(400).json({ error: e.message});
  }
});

function checkArgumentProvided(sourceAddress, fromDate, toDate){
    if(!sourceAddress){
        throw new Error("Source Address parameter is not provided");
    }  
    if(!fromDate){
        throw new Error("From Date parameter is not provided");
    }
    if(!toDate){
        throw new Error("To Date parameter is not provided");
    } 
}

function checkArgumentIsString(sourceAddress, fromDate, toDate){
    if (!(typeof sourceAddress == 'string')) {
        throw new Error("Source Address parameter is not string type");
    }
    if (!(typeof fromDate == 'string')) {
        throw new Error("From Date parameter is not string type");
    }
    if (!(typeof toDate == 'string')) {
        throw new Error("To Date parameter is not string type");
    }
}

function checkArgumentIsNullOrEmpty(sourceAddress, fromDate, toDate){
    if (sourceAddress == null || sourceAddress.trim() === ''){
        throw new Error("Source Address parameter is empty");
    }
    if (fromDate == null || fromDate.trim() === ''){
        throw new Error("From Date parameter is empty");
    }
    if (toDate == null || toDate.trim() === ''){
        throw new Error("To Dateparameter is empty");
    }
}

module.exports = router;

