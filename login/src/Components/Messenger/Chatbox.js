import React from 'react'

export default function Chatbox(props) {
  return (
    <form className={props.className} onSubmit={props.onSubmit}>
      <input 
        type='text' 
        onChange={props.onChange}
        value={props.inputValue}
        placeholder='Type a message...'/>
        
      <button type='submit'>Send</button>
    </form>
  )
}
