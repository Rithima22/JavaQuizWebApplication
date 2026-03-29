import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try sessionStorage first (tab-specific), then localStorage (persistent login)
    const session = sessionStorage.getItem('user')
    if (session) return JSON.parse(session)
    const stored = localStorage.getItem('user')
    if (stored) {
      // Migrate to sessionStorage for this tab
      const u = JSON.parse(stored)
      const t = localStorage.getItem('token')
      sessionStorage.setItem('user', stored)
      sessionStorage.setItem('token', t)
      return u
    }
    return null
  })

  const login = (userData, token) => {
    // Save to both so refresh works, sessionStorage for tab isolation
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    sessionStorage.clear()
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}