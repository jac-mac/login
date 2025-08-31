const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  sender: mongoose.Types.ObjectId,
  receiver: mongoose.Types.ObjectId,
  content: String,
}, {timestamps: true })

module.exports = mongoose.model('message', MessageSchema)