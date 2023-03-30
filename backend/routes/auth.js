const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetcfhuser')

//a secret key for jwt token sign
const JWT_SECRET = "meriMazry$123";

//create a user using POST 'api/auth/createuser' . Doesnt require auth

router.post(
  "/createuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be 8 Characters Long").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if there are errors return bad request and errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check the User Email is Present , If Yes Return already exists message

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            error:
              "User with this Email is Already Present, Please Try another Email",
          });
      }

      //process for password hashing

      // Generating Salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Creating User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      //jwt signing the document
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ reply: authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error Occured");
    }
    //   .then(user => res.json(user))
    //   .catch((err) => {
    //     res.json( {error:"Email is already Registered,Try Logging in..."})    });
  }
);

//creating route for the login
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password can not be Blank").exists(),
  ],
  async (req, res) => {
    // Checking for error if any
    const errors = validationResult(req);

    // if there are errors return bad request and errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //array destructuring
    const { email, password } = req.body;

    //try catch block for the checking the proper functioning
    try {
        
      let user = await User.findOne({email});

      //if user does not exist
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please enter a valid Email or a Password" });
      }
   
      //comparing the password with the hashed data
      const comparePassword = bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(400)
          .json({ error: "Please enter a valid Email or a Password" });
      }


      //jwt signing the document
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);


      //if everything happens correctly return response
      res.json({ reply: authToken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }
  }
);


//Route 3 :  Creating a Get loggedin User Details Using : Post "/api/auth/getuser". Login Required
router.post("/getuser",fetchuser,async (req, res) => {
   
    try {
       userId = req.user.id;
     const user = await User.findById(userId).select("-password");
     res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error Occured");
    }
    
  }
);
module.exports = router;
