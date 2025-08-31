const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const mongoose = require('mongoose')
const crypto = require('crypto')
require('dotenv').config()
const PORT = process.env.PORT
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING
const KEY = process.env.SECRET_KEY
const db = mongoose.connection
mongoose.connect(CONNECTION_STRING)
db.once('open', () => console.log('Connected to MongoDB'))
const app = express()


const userRoute    = require('./Routes/UserRoute')
const jwtsRoute    = require('./Routes/JWTSRoute')
const messageRoute = require('./Routes/MessageRoute')
const conversationRoute = require('./Routes/ConversationRoute')

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/user', userRoute)
app.use('/jwt', jwtsRoute)
app.use('/message', messageRoute)
app.use('/conversation', conversationRoute)

const checkAuthAndRedirect = (req, res, next) => {
  // const refreshToken = req.cookies.refreshToken
  // console.log(refreshToken)

  // if(!refreshToken) {
  //   return next()
  // }

  // try {
  //   const decodedToken = jwt.verify(refreshToken, KEY)
  //   console.log('Decoded Token:',decodedToken)
  //   // res.redirect('/dashboard')
  // }
  // catch (error) {
  //   res.clearToken('refreshToken')
  //   next()
  // }
}

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`)
})

app.get('/', checkAuthAndRedirect, (req, res) => {
  res.send('Hello from the main route.')
})

app.get('/check-auth', (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken) {
    console.log('No active session. Redirecting to Login')
    return res.status(404).redirect('/')
  }

  try {
    console.log('Token exists...')
    jwt.verify(refreshToken, KEY)
    console.log('Token verified. Redirecting to Dashboard.')
    return res.status(200).json({success: true, message: 'Redirecting to dashboard.'})
  } catch (error) {
    console.error({message: error.message})
  }
})