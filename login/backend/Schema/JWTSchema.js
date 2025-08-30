const mongoose = require('mongoose')

const JWTSSchema = new mongoose.Schema({
  jti: String,
  user_id: mongoose.Types.ObjectId,
}, { timestamps: true })

module.exports = mongoose.model('jwt', JWTSSchema)