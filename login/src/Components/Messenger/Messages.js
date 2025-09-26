import React, { useState } from 'react'
import Message from './Message'
import './Messages.css'

const Messages = ({messages}) => {
  
  return (
    <ol className='message-list'>
      {messages.map(message => (
        <Message 
          id={message._id} 
          content={message.content} 
          sender={message.sender} 
          receiver={message.receiver} />
      ))}
    </ol>
  )
}

export default React.memo(Messages)
