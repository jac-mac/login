import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export const useUserContext = () => {
  return (useContext(UserContext))
}

export const UserProvider = ( {children} ) => {
  const [userData, setUserData] = useState({})

  const value = {
    userData,
    setUserData
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
