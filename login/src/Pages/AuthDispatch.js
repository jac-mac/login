import React, { useEffect, useState } from "react";
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import Signup from '../Pages/Signup'
import { UserProvider } from '../Contexts/UserContext'
import { useNavigate, Routes, Route } from 'react-router-dom'
// import { useUserContext } from '../Contexts/UserContext'

export default function AuthDispatch({ children }) {
  // const { setUser } = useUserContext()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/check-auth", {
          credentials: "include",
        });
        if (response.ok) {
          setLoading(true)
          navigate("/dashboard");
        }
      } catch (error) {
        console.error({ message: "Could not access db" });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div style={{backgroundColor: '#282c34'}}></div>
  }
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </UserProvider>
  );
}
