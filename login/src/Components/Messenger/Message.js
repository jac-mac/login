import React, { use } from 'react'
import './Message.css'
import { useUserContext } from '../../Contexts/UserContext'

export default function Message({content, sender, receiver, id}) {
  const {userData} = useUserContext()
  console.log(`Message from ${sender} (${content})`)

  if(!userData.id) {
    return null
  }
  return (
    <li 
      className='message'
      style={{alignSelf: sender === userData.id ? 'flex-end' : 'flex-start'}}
      key={id}>
      {content}
    </li>
  )
}
