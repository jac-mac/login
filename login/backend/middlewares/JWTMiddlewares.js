import JWT from '../Schema/JWTSchema.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const KEY = process.env.SECRET_KEY

export const tokenValidation = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token not found in cookies.'
    })
  }
  try {
    const decodedToken = jwt.verify(refreshToken, KEY)
    req.decodedToken = decodedToken
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const tokenLookup = async (req, res, next) => {
  const jti = req.decodedToken.jti
  try {
    const jtiFromDb = await JWT.find({jti: jti})
    if(!jtiFromDb) {
      return res.status(404).json({
        success: false,
        message: 'Invalid authentication: No valid JWT associated with user.'
      })
    }
    req.jti = jtiFromDb
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}