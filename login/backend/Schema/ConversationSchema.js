const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
  participants: Array,
  messages: Array
})

module.exports = mongoose.model('conversation', ConversationSchema)

//6892a9134b1684e846802175
//689ba806a5d1648d55ae3a2e