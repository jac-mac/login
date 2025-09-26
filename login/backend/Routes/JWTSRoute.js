import express from 'express'
import cors from 'cors'
import { createAndStoreRefreshToken } from '../helpers/tokenService.js'
import jwt from 'jsonwebtoken'
import JWT from '../Schema/JWTSchema.js'
const jwtsRouter = express.Router()
const KEY = process.env.SECRET_KEY

jwtsRouter.use(cors({origin: 'http://localhost:3000'}))

const decodeToken = async (req, res, next) => {
  const jti = req.body.jti
  const refreshToken = req.cookies.refreshToken
  try {
    const token = await JWT.findOne({jti: jti})
    const tokenJti = token.jti
    const decodedToken = jwt.verify(refreshToken, KEY)
    req.jwtData = {jti: tokenJti}
    next()
  } catch (error) {
    console.log('Error')
    return res.status(404).json({message: 'Token not found for specified user.'})
  }
}

jwtsRouter.get('/', decodeToken, async (req, res) => {
  const jti = req.body.jti
  try {
    const token = await JWT.findOne({jti: jti})
    //get jti and user_id (token), return 
    res.status(200).json(token)
  }
  catch (error) {
    console.log(error)
  }

})

jwtsRouter.post('/', decodeToken, async (req, res) => {
  console.log(req.jwtData)
})

//updates refresh token
jwtsRouter.post('/refresh', async (req, res) => { //use protected middleware
  const oldRefreshToken = req.cookies.refreshToken
  const user_id = req.body.user_id
  try {
    const decodedToken = jwt.verify(oldRefreshToken, KEY)
    console.log("Got here")
    const jti = await JWT.findOne({jti: decodedToken.jti})
    console.log(jti)
    if(jti) {
      const {accessToken, newRefreshToken} = await createAndStoreRefreshToken(user_id)
      console.log(newRefreshToken)
      const expiration = 7*24*60*60*1000 //1 week
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: expiration
      })
      res.status(200).json({success: true, accessToken: accessToken, id: user_id})
    }
    else {
      res.status(404).json({success: false, message: 'Could not find active refresh token.'})
    }
  }
  catch(error) {
    console.error('Token verification failed:', error.message)
    res.status(401).json({success: false, message: 'Token verification failed. Login again.'})
  }
})

//logout
jwtsRouter.delete('/revoke', async (req, res) => { //use protected middleware
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken) {
    return res.status(401).json({message: 'Refresh token not included in request body.'})
  }

  try {
    const decodedToken = jwt.verify(refreshToken, KEY)
    const tokenJti = decodedToken.jti
    const response = await JWT.findOneAndDelete({jti: tokenJti})
    if(!response) {
      return res.status(404).json({message: `Could not find token with jti: ${tokenJti}`})
    }
    res.clearCookie('refreshToken')
    res.status(200).json({message: 'Successfully deleted jwt.'})
  } catch(error) {
    res.status(404).json({message: 'Cooked.'})
  }
})







export {jwtsRouter}