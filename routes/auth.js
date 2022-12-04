const express = require("express");
const {body,validationResult} = require("express-validator")
const UserModel = require("../models/User");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require("jsonwebtoken");
const getuser = require("../middleware/getuser");
const newjoke = require("../util/getjoke");
const secret_sign = "Y0ur$ecretG0e$Here";
const router = express.Router();
// No loggin  Require 
router.post("/signup",[
    body("name","name must be 3 or more charcter long").isLength({min:3}),
    body("email","email is incorrect ").isEmail({min:4}),
    body("password","password is too short < 3").isLength({min:3})
],async (req,res)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    try {
        // find user with email
        let user = await UserModel.findOne({email:req.body.email});
        console.log(user);

        if(user){   // email alredy exist
            return res.status(400).json({"success":false,"message":"email is already in use"});
        }

        // otherwise - generate salt value
        let mSalt = await bcrypt.genSalt(4);
        // create hash  using salt + user password
        let passHash = await bcrypt.hash(req.body.password,mSalt);
        // save user object
        user = await UserModel.create({
            name:req.body.name,
            password:passHash,
            email:req.body.email
        });
        // this payload is used to create token
        let mPayload = {
            user :{
                id:user.id
            }
        }
        // create token with Secret Key + payload
        const authToken = jsonwebtoken.sign(mPayload,secret_sign);
        // send this token to user
        return res.status(201).json({"success":true,authToken});
    }  
    catch (error) {
        console.log(error);
        return res.status(500).json({"error":"Internal Server Error"})
    }
});

// No loggin  Require 
router.post("/login",[
    body("email","Not a valid Email").isEmail({min:4}),
    body("password","Too short pasword").isLength({min:3})
],async (req,res)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        let [...er] = errors.errors;
        console.log("er ");        
        console.log(er);
        return res.status(400).json(er);
    }
    try {
        let {email,password} = req.body;
        // find user with email in DB
        let foundUser = await UserModel.findOne({email});
        if(!foundUser){ // user does not exist
            return res.status(400).json({"error":"Not a right Credentials"});
        }
        // otherwise compare login password with right password form DB
        let matched = await bcrypt.compare(password,foundUser.password);
        if(!matched){ // password does not matched 
            return res.status(404).json({"error":"Not a right Credentials"})
        }
        // otherwise check create payload form user's id(fetched from DB)
        let mPayload = {
            user:{
                id : foundUser.id
            }
        }
        // create token and send to logged in user
        let authToken = jsonwebtoken.sign(mPayload,secret_sign);
        return res.json({"success":"true",authToken});
    } catch (error) {
        return res.status(500).json({exception});
    }
})

// Login required
router.get("/me",getuser,async (req,res)=>{
    // call middlewear -> [getuser] and get logged in user's id
    try {
        let userId = req.user.id;
        console.log("userId");
        console.log(userId);
        const user = await UserModel.findById(userId).select("-password").select(["-__v","-_id"]);
        console.log(user);
        return res.json({"success":true,user});
    }catch(error) {
        console.log(error);
        return res.status(500).json({"success":false,error})
    }
})

// Login Required
router.get("/logout",async (req,res)=>{
    try {
        // set cookie value with 1ms
        res.cookie("auth-token","",{maxAge:1});
        return res.status(200).json({"success":true,"message":"Logout successfully"})
    } catch (error) {
        console.log("catch"+error)
        return res.status(500).json({"success":false,error})
    }
})

router.get("/random-joke",getuser,(req,res)=>{
    newjoke().then((r)=>{
        return res.json({"success":true,"joke":r.value});
    })
})
module.exports = router;