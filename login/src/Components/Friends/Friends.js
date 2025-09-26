import React from 'react'
import Friend from './Friend'
import './Friends.css'

export default function Friends({friendData, extractFriendData}) {
  // console.log(`Friend Data: ${friendData}`)
  const friends = friendData.map((friend, index) => <Friend extractFriendData={extractFriendData} fullName={friend.firstName + ' ' + friend.lastName} key={index} friendData={friend}/>)
  return (
    <ul className='friends-list'>
      {friends}
    </ul>
  )
}
