import {ObjectId} from 'mongodb'
import Conversation from '../Schema/ConversationSchema.js'
import Message from '../Schema/MessageSchema.js'

export const conversationCheck = async (req, res, next) => {

  const friendId = ObjectId.createFromHexString(req.params.id)
  const userId = ObjectId.createFromHexString(req.decodedToken.user_id)
  const sortedParticipants = [friendId, userId].sort()
  try {
    const conversation = await Conversation.findOne({participants: sortedParticipants})
    if(!conversation) {
      return res.status(404).json({
        success: false,
        message: `Could not find conversation between users ${friendId} and ${userId}`
      })
    }
    req.conversation = conversation
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const conversationMessages = async (req, res, next) => {
  const messageIdArray = req.conversation.messages
  if(messageIdArray.length === 0) {
    return res.status(200).json({
      success: true,
      message: `A conversation between ${req.params.id} and ${req.decodedToken.user_id} exists, but has no messages`
    })
  }
  
  try {
    const messagePromises = messageIdArray.map(messageId => {
      return Message.findOne({_id: messageId})
    })
    const messages = await Promise.all(messagePromises)
    req.messages = messages
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateConversation = async (req, res, next) => {
  const sentMessage = req.sentMessage
  const sender = sentMessage.sender
  const receiver = sentMessage.receiver
  const participants = [sender, receiver].sort()
  try {
    const updatedConversation = await Conversation.updateOne(
      {participants: participants},
      {$push: {messages: sentMessage._id}})
    req.updatedConversation = updatedConversation
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

}