import express from 'express'
const messageRouter = express.Router()
import Message from '../Schema/MessageSchema.js'
import { messageLookupWithSenderId, validateNewMessage, createNewMessage } from '../middlewares/MessagesMiddlewares.js'
import { updateConversation } from '../middlewares/ConversationMiddlewares.js'

messageRouter.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
    if(messages.length === 0) {
      return (
        res.status(404).json({
          success: false, 
          message: 'No messages.'})
        )
    }
    res.status(200).json({
      success: true, 
      message: 'Messages successfully retrieved.', 
      data: messages})
  }
  catch(error) {
    res.status(500).json({success: false, message: error.message})
  }
})

messageRouter.get('/:id', async (req, res) => {
    res.status(200).json({
      success: true,
      message: `Successfully found message with id: ${req.params.id}.`,
      data: req.messages
    })
})

messageRouter.post('/new', validateNewMessage, createNewMessage, updateConversation, async (req, res) => {
  return res.status(201).json({
    success: true,
    data: [
      req.sentMessage,
      req.updatedConversation
    ],
    message: [
      `Successfully created new message: ${req.sentMessage}`,
      `Successfully updated conversation between ${req.sentMessage.sender} and ${req.sentMessage.receiver}`
    ]
  })
})

messageRouter.get('/user/:id', async (req, res) => {
  //if conversation exists collect ids of every message in messages array
  //sort them by createdAt timestamp
  //return them in reverse?? CHECK
})


export {messageRouter}