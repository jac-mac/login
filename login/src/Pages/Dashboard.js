import React from 'react'
import './Dashboard.css'
import { useUserContext } from '../Contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import NavBar from '../Components/NavBar/NavBar'
export default function Dashboard() {
  const { userData } = useUserContext()
  const navigate = useNavigate()
  const handleLogout = async () => {
    const reqBody = {
      user_id: userData.id
    }
    const options = {
      method: 'DELETE',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(reqBody),
      credentials: 'include'
    }
    const response = await fetch('http://localhost:3001/jwt/revoke', options)
    navigate('/')
  }

  return (
    <div className='dashboard'>
      <NavBar handleLogout={handleLogout}/>
    </div>
  )
}
