const express = require("express");
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { createAndStoreRefreshToken } = require('../helpers/tokenService')
const { hashPassword, isHashedPassword } = require('../helpers/hashingService')
const router = express.Router();
router.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
router.use(express.json())
const User = require("../Schema/UserSchema");
const KEY = process.env.SECRET_KEY

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json( {message: error.message})
  }
});


//login
router.post('/login', async (req, res) => {
  const {email, password} = req.body
  let user
  let passwordMatch = false
  try {
    user = await User.findOne({email: email})
  } catch (error) {
    res.status(503).json({message: 'Server is not connected.'})
  }
  //if user with that email exists, compare passwords
  if(user) {
    console.log(user)
    const expiration = 7*24*60*60*1000 //1 week
    passwordMatch = await isHashedPassword(password, user.password)
    if(passwordMatch) {
      const { accessToken, newRefreshToken } = await createAndStoreRefreshToken(user._id)
      res.cookie('refreshToken', newRefreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: "Lax",
        maxAge: expiration
      })
      res.status(200).json({success: true, accessToken: accessToken, id: user._id})
    }
    else {
      res.status(401).json({success: false, message: 'Incorrect password. Try again or reset your password.'})
    }
  } else {
    res.status(404).json({success: false, message: 'Could not find user. Try signing up!'})
  }
})

//signup
router.post('/new', async (req, res) => {
  const { email, password} = req.body

  try {
    const user = await User.findOne({email: email})
    if(user) {
      return res.status(409).json({message: "User already exists. Try logging in."})
    } 
    const hashedPassword = await hashPassword(password)
    console.log(hashedPassword)
    const newUser = new User({
      email: email,
      password: hashedPassword
    })
    const savedUser = await newUser.save()
    res.header('Location', `http://localhost:3000/user/${savedUser._id}`)
    res.status(201).json({message: 'Created new user successfully', savedUser})
  }
  catch(error) {
    res.status(500).json({message: 'Server could not add new user.'})
  }
})

module.exports = router;
