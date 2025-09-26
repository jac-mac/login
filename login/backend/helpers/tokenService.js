import JWT from '../Schema/JWTSchema.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const KEY = process.env.SECRET_KEY

export const tokenValidation = (req, res, next) => {
  const refreshToken = req.cookie.refreshToken
  if(!refreshToken) {
    return res.status(400).json({success: true,
      message: 'Refresh token not found in cookies.'
    })
  }
  try {
    const decodedToken = jwt.verify(refreshToken, KEY)
    req.decodedToken = decodedToken
  }
  catch(error) {
    return res.status(401).json({success: true, message: error.message})
  }
  next()
}

export const tokenLookup = async (req, res, next) => {
  try {
    const jti = await JWT.find({jti: req.decodedToken.jti})
    if(!jti) {
      return res.staus(403).json({success: false, message: 'Token has been revoked. Log in again.'})
    }
  }
  catch(error) {
    return res.status(500).json({success: false, message: error.message})
  }
  next()
}


//requires decodedToken to be set in request object
export const generateNewTokens = async (req, res, next) => {
  const jti = crypto.randomUUID()
  const user_id = req.decodedToken.user_id

  const payload = {
    user_id: user_id,
    jti: jti
  }


  try {
    await JWT.findOneAndDelete({user_id: user_id})
    const newJWT = new JWT({
      user_id: user_id,
      jti: jti
    })
    await newJWT.save()
    const newAccessToken = jwt.sign(payload, KEY, {expiresIn: "15m"})
    const newRefreshToken = jwt.sign(payload, KEY, {expiresIn: "7d"})
    req.accessToken = newAccessToken
    req.refreshToken = newRefreshToken
  }
  catch(error) {
    return res.status(500).json({success: false, message: error.message})
  }
  next()
}

export const createAndStoreRefreshToken = async (id) => {
  const jti = crypto.randomUUID()

  const payload = {
    user_id: id,
    jti: jti
  }
  const accessToken = jwt.sign(payload, KEY, { expiresIn: "15m" })
  const newRefreshToken = jwt.sign(payload, KEY, { expiresIn: "7d" })

  try {
    await JWT.findOneAndDelete({user_id: id})
    const newJWT = new JWT({
      user_id: id,
      jti: jti
    })
    await newJWT.save()
  }
  catch(error) {
    console.error("Error saving refresh token: ", error)
  }

  return { accessToken, newRefreshToken }
}

// function tokenMiddleware(accessToken) {
//   try {
//     const decodedToken = jwt.verify(accessToken, KEY)
//     return decodedToken
//   }
//   catch(error) {
//     console.error('Token could not be verified')
//   }
// }

export const validateAndDecodeToken = (req, res, next) => {
  if(!req.cookie.refreshToken) {
    return res.status(400).json({success: false, message: 'Cannot validate token. Token not found in cookies.'})
  }
  const refreshToken = req.cookie.refreshToken
  try {
    const decodedToken = jwt.verify(refreshToken, KEY)
    req.user_id = decodedToken.user_id
    next()
  } catch(error) {
    res.status(500).json({success: false, message: error.message})
  }
}