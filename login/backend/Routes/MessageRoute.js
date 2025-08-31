const express = require('express')
const router = express.Router()
const Message = require('../Schema/MessageSchema')

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) =>{
  const id = req.params.id

  try {
    const message = await Message.findOne({_id: id})
    if(!message) {
      return (
        res.status(404).json({
          success: false,
          message: `Could not find message with id: ${id}.`
        })
      )
    }
    res.status(200).json({
      success: true,
      message: `Successfully found message with id: ${id}.`,
      data: message
    })
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

router.post('/new', async (req, res) => {
  const {sender, receiver, content} = req.body

  if(!sender || !receiver || !content) {
    return (
      res.status(400).json({
        success: false,
        message: 'Bad request. Incomplete request body. Include sender id, receiver id, and message content.',
      })
    )
  }

  try {
    const newMessage = new Message({
      sender: sender,
      receiver: receiver,
      content: content
    })
    const savedMessage = newMessage.save()
    res.status(201).json({
      success: true,
      message: 'Successfully created message.',
      data: savedMessage
    })
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})


module.exports = router