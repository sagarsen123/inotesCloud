const express = require('express')
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
//create a user using POST 'api/auth/createuser' . Doesnt require auth

router.post('/createuser',[
    body('email',"Enter a Valid Email").isEmail(),
    body("name","Enter a valid name").isLength({min:3}),
    body("password","Password must be 8 Characters Long").isLength({min:8})

], async(req,res)=>{

    const errors = validationResult(req);

    // if there are errors return bad request and errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    //Check the User Email is Present , If Yes Return already exists message

    try{

    let user = await User.findOne({email:req.body.email})
    if(user) {
        return  res.status(400).json({error : "User with this Email is Already Present, Please Try another Email"})
    }

    // Creating User
     user = await User.create({
        name: req.body.name,
        email : req.body.email,
        password: req.body.password,
      })
      res.json({ reply :"thank your"})
    }catch(error){
        console.log(error.message)
        res.status(500).send("Some Error Occured");
    }
    //   .then(user => res.json(user))
    //   .catch((err) => {
    //     res.json( {error:"Email is already Registered,Try Logging in..."})    });
})


module.exports = router 