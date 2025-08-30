const bcrypt = require('bcrypt')

async function hashPassword(plainTextPassword) {
  const saltRounds = 10
  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds)
    return hash
  }
  catch(error) {
    console.error('Error hashing password: ', error)
  }
}

async function isHashedPassword(plainTextPassword, hashedPassword) {
  const isSame = await bcrypt.compare(plainTextPassword, hashedPassword)
  return isSame
}

module.exports = {hashPassword, isHashedPassword}