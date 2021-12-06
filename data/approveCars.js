const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const nodemailer = require("nodemailer");
const email = require('../data/sendEmail')

async function getPendingCars(){
try {
    const usersCollection = await users();
    
    let arr = await usersCollection.find().toArray();
    if (arr === null)  {
        throw "Data is not available";
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


async function approveOrRejectCar(id,buttonClicked,adminEmailAddress){
        const usersCollection = await users();
        let arr = await usersCollection.find().toArray();
        if (arr === null)  {
            throw new Error("Data is not available");
        }
        var pendingCars = [];//pending
        let userId = null;
        let recieverEmailId = null;
        for(const element of arr){
            userId = element._id;
            for(const ele of element["cars"]){
                if(ele._id.toString() === id){
                    recieverEmailId = element.email;
                    const carObj = await usersCollection.updateOne({ '_id' : userId, 'cars._id': ele._id },{$set: { 'cars.$.status': buttonClicked }});
                    if(carObj["modifiedCount"] == 1) {
                        //send email
                        let subject = 'Car Approval/Rejection Status';
                        let html = `Your Request has been ${buttonClicked}`;
                        await email.sendEmail(adminEmailAddress,recieverEmailId,subject,html);

                        const carArray = await getPendingCars();
                        if (carArray.length === 0) 
                        {
                            throw "There is no car in pending status";
                        }
                        else{
                            return carArray;
                        }                    
                    }else{
                        throw "There is no car in pending status"; 
                    }

                }
            }
        }
    }

    // async function sendEmail(adminEmailAddress,recieverEmailId,buttonClicked){
    //     let user = "CarCS546Hub@gmail.com";
    //     let pass = "CarCS546HubGroup10";

    //     var transporter = nodemailer.createTransport({
    
    //     service: 'gmail',
    
    //     host: "smtp.gmail.com",
    
    //     secure: false,
    
    //     port: 587,
    
    //     auth: {user, pass},
    
    //     tls: { rejectUnauthorized: false },
    
    //   });
    
    
    //   var mailOptions = {
    
    //     from: adminEmailAddress,
    
    //     to: recieverEmailId,
    
    //     subject: `Car Approval Status`,
    
    //     html: `Your Request has been ${buttonClicked}`
    
    //   };
    
    //   let info = await transporter.sendMail(mailOptions, function (error, info) {
    
    //     if(error){
    //         console.log(error);
    //     }else{
    //         console.log("Message sent");
    //         console.log(info);
    //     }
    
    //   });
    // }
    
    
    module.exports = {
        approveOrRejectCar,
        getPendingCars
    };