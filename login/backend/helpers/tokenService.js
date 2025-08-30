const JWT = require('../Schema/JWTSchema')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const KEY = process.env.SECRET_KEY

async function createAndStoreRefreshToken(id) {
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

function tokenMiddleware(accessToken) {
  try {
    const decodedToken = jwt.verify(accessToken, KEY)
    return decodedToken
  }
  catch(error) {
    console.error('Token could not be verified')
  }
}


module.exports = { createAndStoreRefreshToken, tokenMiddleware }