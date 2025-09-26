const User = require('../Schema/UserSchema')
const { hashPassword, isHashedPassword } = require('../helpers/hashingService')

const validateUserWithCredentials = async (req, res, next) => {
  const {email, password} = req.body

  try {
    const user = await User.findOne({email: email})
    if(!user) {
      return res.status(404).json({success: false, message: `User with email ${email} not found.`})
    }
    //const id = user._id.toString()
    const expiration = 7*24*60*60*1000
    const passwordMatch = await isHashedPassword(password, user.password)
    if(!passwordMatch) {
      return res.status(401).json({success: false, message: `Incorrect password for user with email ${email}`})
    }
  }
  catch(error) {
    return res.status(500).json({success: false, message: error.message})
  }
  next()
}