import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  sender: mongoose.Types.ObjectId,
  receiver: mongoose.Types.ObjectId,
  content: String,
}, {timestamps: true })

export default mongoose.model('message', MessageSchema)