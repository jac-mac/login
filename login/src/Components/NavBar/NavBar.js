import React from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom'

export default function NavBar(props) {
  return (
    <nav className='navbar'>
      <ul>
        <li><a href='#'>About</a></li>
        <li><Link to='http://localhost:3000/parts'>Parts</Link></li>
        <li><Link to='http://localhost:3000/messenger'>Messenger</Link></li>
        <li>
          <button name='logout' type='submit' onClick={props.handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  )
}
