import mongoose from 'mongoose'

const JWTSSchema = new mongoose.Schema({
  jti: String,
  user_id: mongoose.Types.ObjectId,
}, { timestamps: true })

export default mongoose.model('jwt', JWTSSchema)