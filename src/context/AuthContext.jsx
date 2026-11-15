import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('buddy_jwt_token') || null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem('buddy_jwt_token')
    if (!storedToken) {
      setUser(null)
      setProfile(null)
      setIsLoading(false)
      return
    }

    try {
      const res = await api.auth.me()
      if (res.success && res.user) {
        setUser(res.user)
        setProfile(res.user.profile || null)
      } else {
        localStorage.removeItem('buddy_jwt_token')
        setUser(null)
        setProfile(null)
        setToken(null)
      }
    } catch {
      localStorage.removeItem('buddy_jwt_token')
      setUser(null)
      setProfile(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const login = async (email, password) => {
    const res = await api.auth.login(email, password)
    if (res.success && res.token) {
      localStorage.setItem('buddy_jwt_token', res.token)
      setToken(res.token)
      setUser(res.user)
      setProfile(res.user.profile)
      return res
    }
    throw new Error(res.message || 'Login failed')
  }

  const register = async (fullName, email, password) => {
    const res = await api.auth.register(fullName, email, password)
    if (res.success && res.token) {
      localStorage.setItem('buddy_jwt_token', res.token)
      setToken(res.token)
      setUser(res.user)
      setProfile(res.user.profile)
      return res
    }
    throw new Error(res.message || 'Registration failed')
  }

  const logout = () => {
    localStorage.removeItem('buddy_jwt_token')
    setToken(null)
    setUser(null)
    setProfile(null)
  }

  const completeOnboarding = async (onboardingData) => {
    const res = await api.profile.onboarding(onboardingData)
    if (res.success && res.profile) {
      setProfile(res.profile)
      setUser((prev) => prev ? { ...prev, profile: res.profile, completedOnboarding: true } : null)
      return res
    }
    throw new Error(res.message || 'Onboarding failed')
  }

  const updateProfile = async (profileData) => {
    const res = await api.profile.update(profileData)
    if (res.success && res.profile) {
      setProfile(res.profile)
      setUser((prev) => prev ? { ...prev, profile: res.profile } : null)
      return res
    }
    throw new Error(res.message || 'Profile update failed')
  }

  const completedOnboarding = Boolean(profile?.completed_onboarding || user?.completedOnboarding)
  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated,
        isLoading,
        completedOnboarding,
        login,
        register,
        logout,
        completeOnboarding,
        updateProfile,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
