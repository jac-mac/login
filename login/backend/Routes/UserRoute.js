import express from 'express'
import jwt from 'jsonwebtoken'
import { createAndStoreRefreshToken } from '../helpers/tokenService.js'
import { hashPassword, isHashedPassword } from '../helpers/hashingService.js'
import {ObjectId} from 'mongodb'
import User from '../Schema/UserSchema.js'
import { tokenValidation } from '../middlewares/JWTMiddlewares.js'
const userRouter = express.Router();

const KEY = process.env.SECRET_KEY

userRouter.get('/:id/friends/data', async (req, res) => {
  console.log(req.params.id.length)
  const id = ObjectId.createFromHexString(req.params.id)
  try {
    //get selected user
    const user = await User.findOne({_id: id})
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.id} not found.`
      })
    }
    //get their friends' ids
    const friendsIds = user.friends

    if(friendsIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: `User with id ${req.params.id} found, but has no friends.`
      })
    }
    //create an array of promises
    const friendPromises = friendsIds.map((friendId) => {
      return User.findOne({_id: friendId})
    })
    //wait for all of them to resolve
    const friendDataArray = await Promise.all(friendPromises)
    res.status(200).json({
      success: true,
      message: `Friend data for user ${req.params.id} returned successfully.`,
      data: friendDataArray
    })
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

userRouter.get('/:id/friends', async (req, res) => {
  const id = ObjectId.createFromHexString(req.params.id)
  try {
    const user = await User.findOne({_id: id}).populate('friends')
    if(!user) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${req.params.id}`
      })
    }
    console.log(user.friends)
    res.status(200).json({
      success: true,
      message: `${user.friends.length} friends found for user ${req.params.id}`,
      friends: user.friends
    })
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/*** MYSELF ***/
userRouter.get("/", tokenValidation, async (req, res) => {
  const id = req.decodedToken.user_id
  res.status(200).json({
    success: true,
    message: 'Successfully found your user id.',
    data: id
  })
});


//login
userRouter.post('/login', async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findOne({email: email})
    console.log('FOUND USER')
    if(user) {
      //convert BSON Object Id to string for use in browser
      const id = user._id.toString()
      const expiration = 7*24*60*60*1000 //1 week
      const passwordMatch = await isHashedPassword(password, user.password)
      if(passwordMatch) {
        console.log('PASSWORD MATCHED')
        const { accessToken, newRefreshToken } = await createAndStoreRefreshToken(id)
        res.cookie('refreshToken', newRefreshToken, {
          path: '/',
          httpOnly: true,
          sameSite: "Lax",
          maxAge: expiration
        })
        console.log('SENT COOKIE')
        res.status(200).json({success: true, accessToken: accessToken})
      }
      else {
        res.status(401).json({success: false, message: 'Incorrect password. Try again or reset your password.'})
      }
    }
    else {
      res.status(404).json({success: false, message: 'Could not find user. Try signing up!'})
    }
  } catch (error) {
    res.status(500).json({message: 'Server is not connected.'})
  }
  //if user with that email exists, compare passwords
})

//signup
userRouter.post('/new', async (req, res) => {
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

export { userRouter }
