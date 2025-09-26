import Message from '../Schema/MessageSchema.js'
import { ObjectId } from 'mongodb'

export const messageLookupWithSenderId = async (req, res, next) => {
  //string, not url encoded. Converted back to BSON
  const id = ObjectId.createFromHexString(id)
  try {
    const messages = await Message.find({sender: id})
    if(messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No messages found for user ${id.toString()}`
      })
    }
    req.messages = messages
    next()
  }
  catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const validateNewMessage = async (req, res, next) => {
  const { sender, receiver, content } = req.body
  if(!(sender && receiver && content)) {
    return res.status(400).json({
      success: false,
      message: 'Incomplete request body.'
    })
  }
  req.messageData = {
    sender: ObjectId.createFromHexString(sender),
    receiver: ObjectId.createFromHexString(receiver),
    content: content
  }
  next()
}

export const createNewMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.messageData)
    const savedMessage = await newMessage.save()
    req.sentMessage = savedMessage
    next()
  }
  catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

