const { application } = require('express');
const express = require('express');
const { usersdata } = require('../../data');
const router = express.Router();
const data = require('../../data');
const userData = data.usersdata;
const mongoCollections=require('../../config/mongoCollections');
const xss = require('xss');
const e = require('express');

router.post('/', async (req, res) => {
  try {
    
    let uName = xss(req.body.username);
    let pass = xss(req.body.password);
    if(!uName){
        throw `Username required!`;
    }
    if(!pass){
        throw `Password required!`;
    }
    let userName = uName.trim();
    let username = userName.toLowerCase();
    let password = pass.trim();

    if(typeof username !== 'string' || username.length < 4 || username.indexOf(' ') >= 0){
        throw `Invalid Username!`;
    }

    if(password.indexOf(' ') >=0 || password.length < 6) {
        throw `Invalid password!`;
    }

    const isAuth = await userData.checkUser(username, password);
    //const coll = await users();

    if(isAuth.authenticated == true){
        //const user = await coll.findOne({username:username});
        req.session.user = username;
        req.session.userId = isAuth.user_id;
        if(isAuth.role === "admin"){
            req.session.role = true;
        }else{
            req.session.role = false;
        }
       
        res.redirect('/login/private');
    }

  }catch(error){
    res.status(400).render('login/login', {error:error});
  }
});

router.get('/private', async(req, res)=>{
    try {
        res.status(200).render('./carHub/landing', {username:req.session.userId , user : req.session.user, role : req.session.role , loginUser : true});
    } catch (error) {
    }
});

router.get('/signup', async(req,res) =>{
    try {
        if(req.session.userId){
            res.redirect('/login/private');
        }else{
            res.render('login/register');
        }
    } catch (error) {
        
    }
})
router.post('/signup', async(req, res) => {
    try {
        let email = xss(req.body.email);
        let password = xss(req.body.password);
        let firstName = xss(req.body.firstName);
        let lastName = xss(req.body.lastName);
        let age = xss(req.body.age);
        let phoneNumber = xss(req.body.phoneNumber);
        let houseNumber = xss(req.body.houseNumber);
        let street = xss(req.body.street);
        let city = xss(req.body.city);
        let state = xss(req.body.state);
        let zip = xss(req.body.zip);
        
        if(!email){
            throw `Email required!`;
        }
        if(!password){
            throw `Password required!`;
        }
        if(!firstName){
            throw `First Name required!`;
        }
        if(!lastName){
            throw `Last Name required!`;
        }
        if(!age){
            throw `Age is required!`;
        }
        if(!phoneNumber){
            throw `Phone Number is required!`;
        }
        if(!houseNumber){
            throw `House Number is required!`;
        }
        if(!street){
            throw `Street is required`;
        }
        if(!city){
            throw `City is required!`;
        }
        if(!state){
            throw `State is required!`;
        }
        if(!zip){
            throw `Zip is required!`;
        }
        

        let uName = email;
        let userName = uName.trim();
        let username = userName.toLowerCase();
        password = password.trim();
        age = parseInt(age);
        
        if(age < 18){
            throw `You're below 18, sorry!`;
        }
    
        if(typeof username !== 'string' || username.length < 4 || username.indexOf(' ') >= 0){
            throw `Invalid Username!`;
        }
    
        if(password.indexOf(' ') >=0 || password.length < 6) {
            throw `Invalid password!`;
        }

        const response = await usersdata.createUser(username, password, firstName, lastName, phoneNumber, houseNumber, street
            ,city,state,zip);
        //console.log("user created!");

        if(response.userInserted){
            return res.redirect('/');
        }

        return res.status(500).render('login/error', {error:"Internal Server Error!"});
    } catch (error) {
        res.status(400).render('login/register', {error:error});
    }
})

router.get('/', async(req, res) =>  {
  try {
    if(req.session.userId){
        res.redirect('/login/private');
    }
    else{
        res.render('login/login');
    }
  } catch (error) {
    res.render('login/error',{error:'Invalid URL!'});
  }
});

router.get('/', async(req,res) => {
    try{
        if(req.session.userId){
            res.redirect('/login/private');
        }else{
            res.render('login/login');
        }
        
    }catch(e){

    }
});

router.get('/logout', async(req,res) => {
    try {
        req.session.destroy();
        res.status(200).render('./carHub/landing');
    } catch (error) {
        
    }
})

module.exports = router;