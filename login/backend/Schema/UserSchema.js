import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  friends: Array
});

export default mongoose.model('user', UserSchema)
