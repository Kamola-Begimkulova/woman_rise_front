/**
 * Auth state: current user + login/register/logout. Token persisted in
 * localStorage (see api/client.js). Wrap the app once in main.jsx.
 *
 * Usage:  const { user, login, register, logout, loading } = useAuth()
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, setToken, getToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, if a token exists, restore the session.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await authApi.login({ email, password })
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await authApi.register(payload)
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
