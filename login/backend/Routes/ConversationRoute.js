import express from 'express'
import Conversation from '../Schema/ConversationSchema.js'
import {ObjectId} from 'mongodb'
import { conversationCheck, conversationMessages } from '../middlewares/ConversationMiddlewares.js'
import { tokenValidation, tokenLookup } from '../middlewares/JWTMiddlewares.js'
const conversationRouter = express.Router()

//get all
conversationRouter.get('/', async (req, res) => { 
  try {
    const conversations = await Conversation.find()
    if(conversations.length === 0) {
      return res.status(404).json({
                success: false, 
                message: 'There are no active conversations.'})
    }
    res.status(200).json({
      success: true, 
      message: 'Reporting all active conversations.', 
      data: conversations})
  }
  catch(error) {
    res.status(500).json({
      success: false, 
      message: 'Server error trying to retrieve conversations.'})
  }
})

//get conversation by id
conversationRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const conversation = await Conversation.findOne({_id: id})
    if(!conversation) {
      return res.status(404).json({
                success: false, 
                message: `Could not find conversation with id: ${id}.`})
    }
    res.status(200).json({
      success: true, 
      message: `Reporting conversation with id: ${id}.`,
      data: conversation})
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: `Server error trying to retrieve conversation with id: ${id}.`
    })
  }
})

//start new conversation
conversationRouter.post('/', async (req, res) => {
  const participants = req.body.participants
  if(!participants) {
    return res.status(400).json({
              success: false, 
              message: 'Incomplete request body. Participants not found.'})
  }
  const newConversation = new Conversation({
    participants: participants,
    messages: []
  })
  try {
    const savedConversation = await newConversation.save()
    res.status(201).json({
      success: true, 
      message: 'Successfully created conversation.', 
      data: savedConversation})
  }
  catch(error) {
    res.status(500).json({success: false, message: error})
  }
})

//add new message id to message array
conversationRouter.patch('/new-message', async (req, res) => {
  //object
  const messageId = req.body.messageId
  const participants = req.body.participants

  if(!messageId || participants.length < 2) {
    return (
      res.status(400).json({
        success: false,
        message: 'Bad Request. Incomplete request body. Include message and participants.'
      })
    )
  }
  
  try {
    const updatedConversation = await Conversation.findOneAndUpdate({participants: participants}, {$push: {messages: messageId}})
    if(!updatedConversation) {
      return (
        res.status(404).json({
          success: false, 
          message: `Conversation between participants ${participants[0]} and ${participants[1]} could not be updated.`})
      )
    }
    //conversation exists, add id of message to messages array
    res.status(200).json({
      success: true, 
      message: `Conversation between participants ${participants[0]} and ${participants[1]} successfully updated.`,
      data: updatedConversation
    })
  }
  catch(error) {
    res.status(500).json({success: false, message: error.message})
  }

})

conversationRouter.get('/user/:id', tokenValidation, tokenLookup, conversationCheck, conversationMessages, async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Successfully returned conversation with id: ${req.conversation._id}`,
    data: req.messages
  })
})

export {conversationRouter}