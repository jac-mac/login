import React from 'react'

export default function Friend({fullName, extractFriendData, friendData}) {
  // console.log(`Full Name: ${fullName}`)
  console.log(`friendData: ${friendData._id}`)
  const handleFriendClick = (e) => {
    extractFriendData(friendData)
  }
  return (
    <li onClick={handleFriendClick}>
      {fullName}
    </li>
  )
}
