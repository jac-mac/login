import bcrypt from 'bcrypt'

export const hashPassword = async (plainTextPassword) => {
  const saltRounds = 10
  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds)
    return hash
  }
  catch(error) {
    console.error('Error hashing password: ', error)
  }
}

export const isHashedPassword = async (plainTextPassword, hashedPassword) => {
  const isSame = await bcrypt.compare(plainTextPassword, hashedPassword)
  return isSame
}