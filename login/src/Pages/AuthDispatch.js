import React, { useEffect, useState } from "react";
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import Signup from '../Pages/Signup'
import Messenger from './Messenger'
import Parts from './Parts'
import { UserProvider } from '../Contexts/UserContext'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
// import { useUserContext } from '../Contexts/UserContext'

export default function AuthDispatch({ children }) {
  // const { setUser } = useUserContext()
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/check-auth", {
          credentials: "include",
        });
        if (response.ok) {
          setIsAuthenticated(true)
          setIsLoading(true)
          // setLoading(true)
          // navigate("/dashboard");
        }
        else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error({ message: "Could not access db" });
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if(!isLoading) {
      const publicRoutes = ['/', '/login', '/signup']

      if(isAuthenticated && publicRoutes.includes(location.pathname)) {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate])

  if (isLoading) {
    return <div style={{backgroundColor: '#282c34'}}></div>
  }
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/messenger' element={<Messenger />} />
        <Route path='/parts' element={<Parts />} />
      </Routes>
    </UserProvider>
  );
}
