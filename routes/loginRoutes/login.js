const { application } = require('express');
const express = require('express');
const { usersdata } = require('../../data');
const router = express.Router();
const data = require('../../data');
const userData = data.usersdata;
const mongoCollections=require('../../config/mongoCollections');
const users = mongoCollections.usersCreds;

router.post('/', async (req, res) => {
  try {
    
    if(!req.body.username){
        throw `Username required!`;
    }
    if(!req.body.password){
        throw `Password required!`;
    }
    
    const uName = req.body.username;
    const pass = req.body.password;
    const userName = uName.trim();
    const username = userName.toLowerCase();
    const password = pass.trim();

    if(typeof username !== 'string' || username.length < 4 || username.indexOf(' ') >= 0){
        throw `Invalid Username!`;
    }

    if(password.indexOf(' ') >=0 || password.length < 6) {
        throw `Invalid password!`;
    }

    const isAuth = await userData.checkUser(username, password);
    const coll = await users();

    if(isAuth.authenticated == true){
        const user = await coll.findOne({username:username});
        req.session.user = username;
        req.session.userId = user._id;
        res.redirect('/login/private');
    }

  }catch(error){
    res.status(400).render('login/login', {error:error});
  }
});

router.get('/private', async(req, res)=>{

    let loginUser = false;
    try {
        res.status(200).render('./carHub/landing', {username:req.session.userId , user : req.session.user,loginUser : true});
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
        
        if(!req.body.username){
            throw `Username required!`;
        }
        if(!req.body.password){
            throw `Password required!`;
        }

        const uName = req.body.username;
        const pass = req.body.password;
        const userName = uName.trim();
        const username = userName.toLowerCase();
        const password = pass.trim();
    
        if(typeof username !== 'string' || username.length < 4 || username.indexOf(' ') >= 0){
            throw `Invalid Username!`;
        }
    
        if(password.indexOf(' ') >=0 || password.length < 6) {
            throw `Invalid password!`;
        }

        const response = await usersdata.createUser(username, password);
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
        res.render('login/logout');
    } catch (error) {
        
    }
})

module.exports = router;